export const FREE_LIMITS = {
  MAX_FILES_PER_MERGE: 3,
  MAX_FILE_SIZE_MB: 10,
};

export function checkFreemiumLimits(files) {
  if (files.length > FREE_LIMITS.MAX_FILES_PER_MERGE) {
    return {
      allowed: false,
      reason: `Free tier is limited to ${FREE_LIMITS.MAX_FILES_PER_MERGE} files per merge. Upgrade to Pro for unlimited batch processing!`,
    };
  }

  for (const file of files) {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > FREE_LIMITS.MAX_FILE_SIZE_MB) {
      return {
        allowed: false,
        reason: `File "${file.name}" exceeds the free limit of ${FREE_LIMITS.MAX_FILE_SIZE_MB}MB. Upgrade to Pro for files up to 100MB.`,
      };
    }
  }

  return { allowed: true };
}