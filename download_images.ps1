$topDir = 'public/images/ecommerce'
if (!(Test-Path $topDir)) { New-Item -ItemType Directory -Force -Path $topDir }

$images = @(
    @('p1.jpg', 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'),
    @('p2.jpg', 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80'),
    @('p3.jpg', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80'),
    @('p4.jpg', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'),
    @('p5.jpg', 'https://images.unsplash.com/photo-1594620302200-a57f311dde3c?auto=format&fit=crop&w=800&q=80'),
    @('p6.jpg', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=80'),
    @('p7.jpg', 'https://images.unsplash.com/photo-1513506003013-d3c26b8cb793?auto=format&fit=crop&w=800&q=80'),
    @('p8.jpg', 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80')
)

foreach ($img in $images) {
    Write-Host "Downloading $($img[0])..."
    Invoke-WebRequest -Uri $img[1] -OutFile "$topDir/$($img[0])"
}
Write-Host "Done."
