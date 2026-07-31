$patterns = @{
    "â¤ï¸" = "❤️"
    "â¤ï¸" = "❤️"

    "đŸ‘" = "👁️"
    "đŸ›’" = "🛒"
    "đŸ›ï¸" = "🛍️"
    "đŸ”™" = "🔙"

    "âŒ" = "❌"
    "âœ…" = "✅"
    "âœ" = "✅"

    "â†" = "←"
    "â­" = "⭐"

    "â€¢â€¢â€¢â€¢â€¢â€¢" = "••••••"

    "Â·" = "·"
    "â€”" = "—"
    "âˆ’" = "−"

    "Äang táº£i" = "Đang tải"
    "ÄÆ¡n chÆ°a thanh toĂ¡n" = "Đơn chưa thanh toán"
    "Tá»•ng" = "Tổng"
    "Thanh toĂ¡n" = "Thanh toán"
    "Huá»·" = "Huỷ"

    "Lá»—i táº£i danh má»¥c" = "Lỗi tải danh mục"
    "dĂ¹ng default" = "dùng default"
}


$files = Get-ChildItem `
    -Recurse `
    -File `
    -Include *.ts,*.tsx `
    -Path app,components,lib


foreach($file in $files){

    $path=$file.FullName

    $text=[System.IO.File]::ReadAllText(
        $path,
        [System.Text.Encoding]::UTF8
    )

    $old=$text


    foreach($key in $patterns.Keys){

        $text=$text.Replace(
            $key,
            $patterns[$key]
        )
    }


    if($text -ne $old){

        [System.IO.File]::WriteAllText(
            $path,
            $text,
            New-Object System.Text.UTF8Encoding($false)
        )

        Write-Host "FIXED: $path" -ForegroundColor Green
    }
}