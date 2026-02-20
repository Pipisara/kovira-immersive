$baseUrl = "https://images.unsplash.com/"
$images = @{
    "fries.jpg" = "photo-1573080496987-a20d6ab60c24?w=600"
    "sandwich-detail.jpg" = "photo-1553909489-cd47e3b21181?w=800"
}

$dest = "public/images/restaurant"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest }

foreach ($key in $images.Keys) {
    $url = $baseUrl + $images[$key]
    $file = Join-Path $dest $key
    Write-Host "Downloading $key from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $file
    } catch {
        Write-Error "Failed to download $key: $_"
    }
}
Write-Host "Done."
