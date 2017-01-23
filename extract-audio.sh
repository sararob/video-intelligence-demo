#!/bin/bash
BUCKET=gs://allenday-dev/videos-clio-awards
HERTZ=1
sudo apt-get install ffmpeg -y
for i in `gsutil ls $BUCKET/*.mp4`; do
  #pull source
  gsutil cp $i ./

  #setup
  j=`basename $i`
  mkdir ${j/.mp4/-img}

  #convert and upload audio
  ffmpeg -i $j ${j/mp4/mp3}
  gsutil mv ${j/mp4/mp3} $BUCKET/

  #convert and upload frame grabs
  ffmpeg -y -i $j -vf fps=$HERTZ ${j/.mp4/-img}/%03d.jpg
  gsutil -m mv ${j/.mp4/-img} $BUCKET/

  #cleanup
  rmdir ${j/.mp4/-img}
  rm -f $j
done