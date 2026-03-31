# 設定変数
$URL = "http://localhost:3000/30"
$CONCURRENCY = 20
$DURATION = 5

Write-Host "Starting load test..." -ForegroundColor Cyan
Write-Host "Target: $URL"
Write-Host "Concurrency: $CONCURRENCY, Duration: $DURATION seconds"

# npx loadtest の実行
# PowerShellでは外部コマンドに引数を渡す際、変数をそのまま記述できます
npx loadtest -c $CONCURRENCY -t $DURATION $URL

Write-Host "Load test finished." -ForegroundColor Green