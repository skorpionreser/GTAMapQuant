# Production configuration

The production JWT signing key must be supplied by the hosting platform's secret store.
It must never be committed to `appsettings.json`, a frontend environment file, or a pull request.

Configure these application environment variables in the hosting platform:

```text
Jwt__Issuer=GTAMapQuant.Api
Jwt__Audience=GTAMapQuant.Frontend
Jwt__ExpiresInMinutes=120
Jwt__Key=<base64-encoded-random-32-byte-key>
```

`Jwt__Key` is read by ASP.NET Core as `Jwt:Key`. Generate it outside the repository, for example:

```powershell
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
[Convert]::ToBase64String($bytes)
```

For local development, use .NET user secrets instead of adding the key to a tracked configuration file:

```powershell
dotnet user-secrets set "Jwt:Key" "<local-base64-key>" --project backend/GTAMapQuant.Api
```
