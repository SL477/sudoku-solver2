
$orgData = Get-Content -Path .\p096_sudoku.txt

1..50 | ForEach-Object {
    $line = ""
    $correctionAmt = (10 * ($_ - 1))
    1..9 | ForEach-Object {
        $line += $orgData[$correctionAmt + $_]
    }
    echo $line.Replace("0", ".")
}