# Security Hardening Notes

## Secrets

- Never commit API keys, service-account files, private keys, or ad-hoc credential test scripts.
- Store runtime secrets in `.env.local`, deployment secrets, or the host secret manager.
- Google service account files belong in `credentials/`, which is ignored by git.

## Rotating Exposed Qdrant Keys

1. Create a new Qdrant API key in Qdrant Cloud.
2. Update deployment and local `.env.local` values with the new key.
3. Revoke the exposed key.

## CI Secret Scanning

GitHub Actions runs Gitleaks against the checked-out tree on every push and pull request. A failure means the secret must be removed and, if it was valid, rotated before merging.
