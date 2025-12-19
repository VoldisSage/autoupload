Param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
  Write-Error "node not found on PATH."
  exit 1
}

$nodePath = $nodeCmd.Source
$nodeDir = Split-Path $nodePath
$npmCli = Join-Path $nodeDir "node_modules/npm/bin/npm-cli.js"

if (-not (Test-Path $npmCli)) {
  Write-Error "npm-cli.js not found at: $npmCli"
  exit 1
}

& $nodePath $npmCli @Args
exit $LASTEXITCODE
