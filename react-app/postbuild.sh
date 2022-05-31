# (Get-Content ./build/index.html) ` -replace '</head>.*</div>', '' ` -replace '', '' | 
#    Out-File -Encoding 'UTF8' ./build/index-fixed.html
# 
sed 's/<\/head>.*<\/div>//
     s/<\/title>.*<script>/<\/title><\/head><body><noscript>You need to enable JavaScript to run this app.<\/noscript><div id=\"root\"><\/div><script>/' \
    "./build/index.html" > "./build/index-fixed.html"
# mv ./build/index-fixed.html ./build/index.html

# code to fix the ttf file and it's reference to txt.
sed -E 's/codicon\.(.*)\.ttf/codicon.\1.txt/' "./build/index-fixed.html" > "./build/index.html"
rm ./build/index-fixed.html
for f in ./build/static/media/codicon.*.ttf; do
    mv -- "$f" "${f%.ttf}.txt"
done