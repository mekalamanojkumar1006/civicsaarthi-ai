Add-Type -AssemblyName System.Drawing

$publicDir = Join-Path $PSScriptRoot "..\public"

$sizes = @(
    @{ Name = "favicon-16x16.png"; Size = 16 },
    @{ Name = "favicon-32x32.png"; Size = 32 },
    @{ Name = "apple-touch-icon.png"; Size = 180 },
    @{ Name = "android-chrome-192x192.png"; Size = 192 },
    @{ Name = "android-chrome-512x512.png"; Size = 512 }
)

$navy = [System.Drawing.Color]::FromArgb(255, 20, 43, 74)   # #142B4A
$teal = [System.Drawing.Color]::FromArgb(255, 15, 139, 141)  # #0F8B8D
$white = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)
$tealBorder = [System.Drawing.Color]::FromArgb(60, 15, 139, 141)

function Draw-RoundedRect($graphics, $brush, [float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = [float]($r * 2.0)
    if ($d -gt $w) { $d = $w }
    if ($d -gt $h) { $d = $h }
    $path.AddArc($x, $y, $d, $d, [float]180.0, [float]90.0)
    $path.AddArc([float]($x + $w - $d), $y, $d, $d, [float]270.0, [float]90.0)
    $path.AddArc([float]($x + $w - $d), [float]($y + $h - $d), $d, $d, [float]0.0, [float]90.0)
    $path.AddArc($x, [float]($y + $h - $d), $d, $d, [float]90.0, [float]90.0)
    $path.CloseFigure()
    $graphics.FillPath($brush, $path)
    $path.Dispose()
}

foreach ($item in $sizes) {
    $s = [int]$item.Size
    $u = [float]($s / 64.0)

    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)

    # 1. Background white container badge
    $r = [float][Math]::Max(2.0, 14.0 * $u)
    $whiteBrush = New-Object System.Drawing.SolidBrush($white)
    Draw-RoundedRect $g $whiteBrush ([float]0.5) ([float]0.5) ([float]($s - 1.0)) ([float]($s - 1.0)) $r

    # Subtle Teal Border
    $penW = [float][Math]::Max(1.0, 1.2 * $u)
    $borderPen = New-Object System.Drawing.Pen($tealBorder, $penW)
    $borderPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = [float]($r * 2.0)
    $borderPath.AddArc([float]0.5, [float]0.5, $d, $d, [float]180.0, [float]90.0)
    $borderPath.AddArc([float]($s - 1.0 - $d), [float]0.5, $d, $d, [float]270.0, [float]90.0)
    $borderPath.AddArc([float]($s - 1.0 - $d), [float]($s - 1.0 - $d), $d, $d, [float]0.0, [float]90.0)
    $borderPath.AddArc([float]0.5, [float]($s - 1.0 - $d), $d, $d, [float]90.0, [float]90.0)
    $borderPath.CloseFigure()
    $g.DrawPath($borderPen, $borderPath)
    $borderPath.Dispose()
    $borderPen.Dispose()

    # 2. Triangular Roof / Pediment (Navy)
    $navyBrush = New-Object System.Drawing.SolidBrush($navy)
    $pTop = New-Object System.Drawing.PointF([float](32.0 * $u), [float](11.0 * $u))
    $pRight = New-Object System.Drawing.PointF([float](53.0 * $u), [float](23.0 * $u))
    $pLeft = New-Object System.Drawing.PointF([float](11.0 * $u), [float](23.0 * $u))
    $roofPts = [System.Drawing.PointF[]]@($pTop, $pRight, $pLeft)
    $g.FillPolygon($navyBrush, $roofPts)

    # 3. Entablature Beam (Teal)
    $tealBrush = New-Object System.Drawing.SolidBrush($teal)
    $beamH = [float][Math]::Max(1.5, 3.0 * $u)
    $beamR = [float][Math]::Max(0.5, 1.0 * $u)
    Draw-RoundedRect $g $tealBrush ([float](13.0 * $u)) ([float](24.5 * $u)) ([float](38.0 * $u)) $beamH $beamR

    # 4. 4 Classical Pillars (Navy)
    $pillarW = [float][Math]::Max(1.0, 4.5 * $u)
    $pillarH = [float](13.5 * $u)
    $pillarY = [float](29.5 * $u)
    $pr = [float][Math]::Max(0.5, 1.0 * $u)

    Draw-RoundedRect $g $navyBrush ([float](17.5 * $u)) $pillarY $pillarW $pillarH $pr
    Draw-RoundedRect $g $navyBrush ([float](25.5 * $u)) $pillarY $pillarW $pillarH $pr
    Draw-RoundedRect $g $navyBrush ([float](34.0 * $u)) $pillarY $pillarW $pillarH $pr
    Draw-RoundedRect $g $navyBrush ([float](42.0 * $u)) $pillarY $pillarW $pillarH $pr

    # 5. Upper Step (Teal)
    $stepH = [float][Math]::Max(1.5, 3.0 * $u)
    Draw-RoundedRect $g $tealBrush ([float](14.5 * $u)) ([float](45.0 * $u)) ([float](35.0 * $u)) $stepH $beamR

    # 6. Lower Base Foundation (Navy)
    $baseH = [float][Math]::Max(2.0, 3.5 * $u)
    Draw-RoundedRect $g $navyBrush ([float](10.0 * $u)) ([float](49.5 * $u)) ([float](44.0 * $u)) $baseH $beamR

    $g.Flush()

    $destPath = Join-Path $publicDir $item.Name
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $navyBrush.Dispose()
    $tealBrush.Dispose()
    $whiteBrush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Generated: $($item.Name) ($s x $s)"
}

Write-Host "SUCCESS: All PNG favicon assets created successfully!"
