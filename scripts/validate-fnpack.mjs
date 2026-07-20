import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const indexPath = path.join(repoRoot, 'fnpack.json');
const errors = [];

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkHttpUrl(value, label) {
  if (!isNonEmptyString(value)) {
    errors.push(`${label} must be a non-empty URL string`);
    return;
  }
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      errors.push(`${label} must use http or https`);
    }
  } catch {
    errors.push(`${label} is not a valid URL`);
  }
}

let index;
try {
  index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (error) {
  console.error(`fnpack.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

if (!isObject(index) || Object.keys(index).length === 0) {
  errors.push('fnpack.json root must be a non-empty object');
} else {
  for (const [appName, app] of Object.entries(index)) {
    if (!isObject(app)) {
      errors.push(`top-level entry "${appName}" must be an app object; metadata/comment entries are not supported`);
      continue;
    }

    for (const field of ['display_name', 'desc', 'labels', 'version', 'bug_report_url', 'install_type', 'size', 'changelog']) {
      if (!isNonEmptyString(app[field])) {
        errors.push(`${appName}.${field} must be a non-empty string`);
      }
    }

    if (!isNonEmptyString(app.distributor) && !isNonEmptyString(app.author)) {
      errors.push(`${appName} must define distributor (or legacy author)`);
    }
    if (!isNonEmptyString(app.distributor_url) && !isNonEmptyString(app.author_url)) {
      errors.push(`${appName} must define distributor_url (or legacy author_url)`);
    }

    checkHttpUrl(app.bug_report_url, `${appName}.bug_report_url`);
    checkHttpUrl(app.distributor_url ?? app.author_url, `${appName}.distributor_url`);

    const platforms = Array.isArray(app.platform) ? app.platform : [app.platform ?? 'x86'];
    if (platforms.length === 0 || platforms.some((item) => !['x86', 'arm', 'all'].includes(item))) {
      errors.push(`${appName}.platform contains an unsupported architecture`);
    }

    if (isObject(app.arch_diff)) {
      for (const platform of platforms.filter((item) => item !== 'all')) {
        if (!isObject(app.arch_diff[platform])) {
          errors.push(`${appName}.arch_diff.${platform} is required by platform`);
        } else {
          checkHttpUrl(app.arch_diff[platform].download_url, `${appName}.arch_diff.${platform}.download_url`);
        }
      }
    } else if (isNonEmptyString(app.download_url)) {
      checkHttpUrl(app.download_url, `${appName}.download_url`);
    } else {
      errors.push(`${appName} must define download_url or arch_diff`);
    }

    const appDir = path.join(repoRoot, appName);
    for (const relativePath of ['ICON.PNG', 'README.md']) {
      if (!fs.existsSync(path.join(appDir, relativePath))) {
        errors.push(`${appName}/${relativePath} is missing`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error('FnDepot index validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`FnDepot index is valid: ${Object.keys(index).length} app(s)`);