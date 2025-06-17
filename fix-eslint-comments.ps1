# Ajoute les directives ESLint aux fichiers de test
Get-ChildItem -Recurse -Include *.test.js,*.test.jsx -File | ForEach-Object {
    $path = $_.FullName
    $content = Get-Content $path
    if ($content[0] -notmatch 'eslint-env jest') {
        Set-Content -Path $path -Value "/* eslint-env jest */`n/* global describe, it, expect, jest, beforeEach */`n$($content -join "`n")"
    }
}

# Ajoute les globals Node dans les fichiers de config
@('vite.config.js', 'vitest.config.js', 'tailwind.config.js', 'src/setupTests.js') | ForEach-Object {
    if (Test-Path $_) {
        $content = Get-Content $_
        if ($content[0] -notmatch 'global require') {
            Set-Content -Path $_ -Value "/* global require, __dirname, global */`n$($content -join "`n")"
        }
    }
}
