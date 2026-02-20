$baseUrl = "https://images.unsplash.com/photo-"
$images = @{
    "burger.jpg" = "1568901346375-23c9450c58cd?w=600"
    "sandwich.jpg" = "1528735602780-2552fd46c7af?w=600"
    "pizza.jpg" = "1513104890138-7c749659a591?w=600"
    "fries.jpg" = "1630384060421-a431e4c2545c?w=600"
    "coffee.jpg" = "1572442388796-11668a67e53d?w=600"
    "ice-tea.jpg" = "1556679343-c7306c1976bc?w=600"
    "macaroni.jpg" = "1516100882582-96c3a05fe590?w=600"
    "carrot.jpg" = "1598170845058-32b9d6a5da37?w=600"
    "lettuce.jpg" = "1622206151226-18ca2c9ab4a1?w=600"
    "tomato.jpg" = "1592924357228-91a4daadcfea?w=600"
    "cucumber.jpg" = "1604977042946-1eecc6a22657?w=600"
    "avatar.jpg" = "1438761681033-6461ffad8d80?w=600"
    "sandwich-detail.jpg" = "1553909462-15f55331r233?w=800"
}

$dest = "public/images/restaurant"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest }

foreach ($key in $images.Keys) {
    $url = $baseUrl + $images[$key]
    $file = Join-Path $dest $key
    Write-Host "Downloading $key..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $file
    } catch {
        Write-Error "Failed to download $key"
    }
}
Write-Host "Done."
