# Backup and Restore Guide

This project includes a portable backup script to snapshot both the codebase and the MySQL database into a timestamped archive.

## Prerequisites
- MySQL client tools installed (for `mysqldump` and `mysql`)
  - macOS (Homebrew): `brew install mysql-client`
  - Ensure your shell PATH includes the client binaries. For Homebrew:
    - `echo 'export PATH="/opt/homebrew/opt/mysql-client/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`

## Run a Backup
- Script: `./backup.sh`
- Output:
  - `backups/backup-YYYYmmdd-HHMMSS.tar.gz` — full project snapshot
  - `backups/backup-YYYYmmdd-HHMMSS/db.sql` — database dump included inside the archive as well

The script automatically picks DB credentials from `backend/.env` if present, falling back to:
- DB_HOST=localhost
- DB_USER=root
- DB_PASSWORD=(empty)
- DB_NAME=bihar_election_poll
- DB_PORT=3306

## Restore Steps
1. Extract the archive:
   - `tar -xzf backups/backup-YYYYmmdd-HHMMSS.tar.gz -C /desired/path`
2. Restore database:
   - `mysql -h <host> -P <port> -u <user> -p < backups/backup-YYYYmmdd-HHMMSS/db.sql`
3. Reinstall dependencies and start servers:
   - `npm install`
   - `(cd backend && npm install)`
   - `npm run dev` and `npm run backend`

## Notes
- The archive excludes heavy runtime directories: `node_modules`, `.next`, and the `backups` folder itself.
- For CI or cron-based backups, you can run `backup.sh` non-interactively.
- Keep backups in a secure location; the DB dump may contain sensitive data.
