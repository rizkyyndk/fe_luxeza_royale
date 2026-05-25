import ftp from "basic-ftp";
import dotenv from "dotenv";
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

dotenv.config({ path: ".env.deploy" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

const isCleanDeploy = process.argv.includes("--clean");

const requiredEnv = ["FTP_HOST", "FTP_USER", "FTP_PASSWORD", "FTP_REMOTE_DIR"];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing ${key} in .env.deploy`);
    process.exit(1);
  }
}

const remoteDir = process.env.FTP_REMOTE_DIR;
const publicAppUrl =
  process.env.PUBLIC_APP_URL ||
  "https://be-luxeza-royale.infinityfreeapp.com/app/";

const posixJoin = (...parts) => {
  return parts.join("/").replace(/\\/g, "/").replace(/\/+/g, "/");
};

const getGitCommit = () => {
  try {
    return execSync("git rev-parse --short HEAD", {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "unknown";
  }
};

const ensureDistExists = () => {
  if (!fs.existsSync(distDir)) {
    console.error(
      "❌ Folder dist tidak ditemukan. Jalankan npm run build dulu.",
    );
    process.exit(1);
  }
};

const writeProductionHtaccess = () => {
  const htaccessPath = path.join(distDir, ".htaccess");

  const content = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /app/

    RewriteRule ^index\\.html$ - [L]

    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d

    RewriteRule . /app/index.html [L]
</IfModule>

<IfModule mod_headers.c>
    <FilesMatch "index\\.html$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </FilesMatch>

    <FilesMatch "\\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>
`;

  fs.writeFileSync(htaccessPath, content, "utf8");
};

const writeDeployInfo = () => {
  const deployInfoPath = path.join(distDir, "deploy-info.json");

  const info = {
    app: "Luxeza Royale",
    deployedAt: new Date().toISOString(),
    gitCommit: getGitCommit(),
    remoteDir,
    publicAppUrl,
  };

  fs.writeFileSync(deployInfoPath, JSON.stringify(info, null, 2), "utf8");
};

const walkFiles = (dir, baseDir = dir) => {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...walkFiles(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      result.push({
        fullPath,
        relativePath,
      });
    }
  }

  return result;
};

const hashFile = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

const createManifest = () => {
  const files = walkFiles(distDir);

  const manifest = {
    generatedAt: new Date().toISOString(),
    gitCommit: getGitCommit(),
    files: {},
  };

  for (const file of files) {
    const stat = fs.statSync(file.fullPath);

    manifest.files[file.relativePath] = {
      size: stat.size,
      hash: hashFile(file.fullPath),
    };
  }

  return manifest;
};

const writeLocalManifest = (manifest) => {
  const manifestPath = path.join(distDir, ".deploy-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
};

const readRemoteManifest = async (client) => {
  const tempPath = path.join(projectRoot, ".deploy-manifest.remote.tmp.json");

  try {
    await client.downloadTo(tempPath, ".deploy-manifest.json");
    const raw = fs.readFileSync(tempPath, "utf8");
    fs.unlinkSync(tempPath);
    return JSON.parse(raw);
  } catch {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }

    return null;
  }
};

const ensureRemoteSubdir = async (client, relativeFilePath) => {
  const remoteSubdir = path.posix.dirname(relativeFilePath);

  if (remoteSubdir === ".") {
    await client.ensureDir(remoteDir);
    return;
  }

  await client.ensureDir(posixJoin(remoteDir, remoteSubdir));
};

const uploadChangedFiles = async (client, localManifest, remoteManifest) => {
  const localFiles = localManifest.files;
  const remoteFiles = remoteManifest?.files || {};

  let uploadedCount = 0;
  let skippedCount = 0;

  for (const [relativePath, localMeta] of Object.entries(localFiles)) {
    const remoteMeta = remoteFiles[relativePath];
    const needsUpload = !remoteMeta || remoteMeta.hash !== localMeta.hash;

    if (!needsUpload) {
      skippedCount += 1;
      continue;
    }

    await ensureRemoteSubdir(client, relativePath);

    const localPath = path.join(distDir, relativePath);
    const remotePath = posixJoin(remoteDir, relativePath);

    console.log(`⬆️  Upload: ${relativePath}`);
    await client.uploadFrom(localPath, remotePath);

    uploadedCount += 1;
  }

  console.log(`✅ Uploaded: ${uploadedCount} file(s)`);
  console.log(`⏭️  Skipped unchanged: ${skippedCount} file(s)`);
};

const deleteStaleFiles = async (client, localManifest, remoteManifest) => {
  if (!remoteManifest?.files) {
    console.log("ℹ️  No previous remote manifest. Skip stale file cleanup.");
    return;
  }

  const localFiles = localManifest.files;
  const remoteFiles = remoteManifest.files;

  let deletedCount = 0;

  for (const relativePath of Object.keys(remoteFiles)) {
    if (localFiles[relativePath]) continue;

    try {
      console.log(`🗑️  Delete stale: ${relativePath}`);
      await client.remove(posixJoin(remoteDir, relativePath));
      deletedCount += 1;
    } catch {
      console.log(`⚠️  Failed to delete stale file: ${relativePath}`);
    }
  }

  console.log(`✅ Deleted stale files: ${deletedCount}`);
};

const uploadManifest = async (client) => {
  const manifestPath = path.join(distDir, ".deploy-manifest.json");
  await client.uploadFrom(
    manifestPath,
    posixJoin(remoteDir, ".deploy-manifest.json"),
  );
};

const main = async () => {
  ensureDistExists();

  writeProductionHtaccess();
  writeDeployInfo();

  const localManifest = createManifest();
  writeLocalManifest(localManifest);

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log("🚀 Luxeza Royale InfinityFree Deploy");
    console.log(
      `Mode: ${isCleanDeploy ? "clean deploy" : "incremental deploy"}`,
    );
    console.log(`Remote: ${remoteDir}`);
    console.log("");

    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    console.log("✅ Connected to InfinityFree FTP");

    await client.ensureDir(remoteDir);
    await client.cd(remoteDir);

    let remoteManifest = null;

    if (isCleanDeploy) {
      console.log("🧹 Clearing remote directory...");
      await client.clearWorkingDir();
    } else {
      remoteManifest = await readRemoteManifest(client);
    }

    await uploadChangedFiles(client, localManifest, remoteManifest);
    await deleteStaleFiles(client, localManifest, remoteManifest);
    await uploadManifest(client);

    console.log("");
    console.log("🎉 Deploy selesai!");
    console.log(`Frontend URL: ${publicAppUrl}`);
    console.log(`Deploy info: ${publicAppUrl}deploy-info.json`);
  } catch (error) {
    console.error("");
    console.error("❌ Deploy gagal:");
    console.error(error.message || error);
    process.exit(1);
  } finally {
    client.close();
  }
};

main();
