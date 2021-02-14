$ curl --request POST \
    --url http://localhost:3000/convert/html \
    --header 'Content-Type: multipart/form-data' \
    --form files=@index.html --form files=@TL_Icon.png --form files=@style.css --form marginTop=0.5 --form files=@TL_Logo_W.png --form files=@gic.svg --form files=@reset.css \
    --form marginBottom=0.5 \
    --form marginLeft=0.5 \
    --form marginRight=0.5 \
    -o result.pdf
