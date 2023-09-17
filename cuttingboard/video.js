const { createFFmpeg, fetchFile } = FFmpeg;
        let ffmpeg = null;
        const transcode = async () => {
          const inputVideo = document.getElementById('uploader');
          const inputSubs = document.getElementById('subs');
          const inputMark = document.getElementById('marker')
          const subname = 'subtitleFile.srt';
          const videoFile = inputVideo.files[0];
          var subtitleFile = inputSubs.files[0];
          var watermarkFile = inputMark.files[0];
          var c1 = '-c';
          var c2 = 'copy';
          var c3 = '';
          var c4 = '';
          var vc1 = '';
          var vc2 = '';
          var vc3 = '';
          var w1 = '';
          var m1 = '';
          var m2 = '';
          if (ffmpeg === null) {
            ffmpeg = createFFmpeg({ log: false});
          }
          const message = document.getElementById('message');
          message.innerHTML = 'Reading Files';
          const name = videoFile.name;
          if (!ffmpeg.isLoaded()) {
            await ffmpeg.load();
          }
          ffmpeg.FS('writeFile', name, await fetchFile(videoFile));
          if(document.getElementById('mark').checked){
            ffmpeg.FS('writeFile', 'watermark.png', await fetchFile(watermarkFile));
            m1 = '-i';
            m2 = 'watermark.png';
          }
          if (document.getElementById('subsCheck').checked && !subtitleFile) {
            subtitleFile = convert();
          }
          if (document.getElementById('subsCheck').checked){
            const fontName = document.getElementById('font').value;
            const subloc = document.getElementById('sublocation').value;
            ffmpeg.FS('writeFile', subname, await fetchFile(subtitleFile));
            if (fontName === 'arial') {
              ffmpeg.FS('writeFile', 'arial', await fetchFile('https://'+window.location.hostname+'/cuttingboard/fonts/arial.ttf'));
            }
            if (fontName === 'helvetica') {
              ffmpeg.FS('writeFile', 'helvetica', await fetchFile('https://'+window.location.hostname+'/cuttingboard/fonts/helvetica.ttf'));
            }
            if (fontName === 'futura') {
              ffmpeg.FS('writeFile', 'futura', await fetchFile('https://'+window.location.hostname+'/cuttingboard/fonts/futura.ttf'));
            }
            c1 = '-c:v';
            c2 = 'libx264';
            vc3 = 'subtitles=/outputsubs.srt:fontsdir=/:force_style=\'FontName=' + fontName + ',Alignment=' + subloc + '\'';
            if(document.getElementById('mark').checked){
              vc1 = '-filter_complex';
              w1 = 'overlay=10:10';
            }
          }
          var start = document.getElementById('start').value;
          var time = document.getElementById('time').value;
          if (document.getElementById('rec').checked) {
            c1 = '-c:v';
            c2 = 'libx264';
            c3 = '-preset';
            c4 = 'ultrafast';
            if(document.getElementById('mark').checked){
              vc1 = '-filter_complex';
              w1 = 'overlay=10:10';
            }
          }
          if (document.getElementById('crop').checked) {
            c1 = '-c:v';
            c2 = 'libx264';
            c3 = '-preset';
            c4 = 'ultrafast';
            vc1 = '-filter_complex';
            vc2 = document.getElementById('cropsize').value;
            if(document.getElementById('mark').checked){
             w1 = ',overlay=10:10';
            }
          }
          if(document.getElementById('subsCheck').checked){
            message.innerHTML = 'Cutting';
            await ffmpeg.run('-ss', start, '-to', time, '-i', name, m1, m2, vc1, vc2+w1, c1, c2, '-preset', 'ultrafast', 'outputone.mp4');
            ffmpeg.FS('unlink', name);
            await ffmpeg.run('-i', subname, '-ss', start, '-to', time, 'outputsubs.srt');
            await ffmpeg.setProgress((p) => message.innerHTML = `Adding Subtitles: ${(p.ratio * 100.0).toFixed(2)}%`);
            await ffmpeg.run('-i', 'outputone.mp4', '-filter_complex', vc3, c1, c2,'-preset', 'ultrafast', 'output-' + name);
          } else {
            message.innerHTML = 'Cutting';
            await ffmpeg.run('-ss', start, '-to', time, '-i', name, m1, m2, vc1, vc2+w1, c1, c2, c3, c4, '-avoid_negative_ts', 'make_zero', 'output-' + name);
        }
          message.innerHTML = 'Completed';
          const data = ffmpeg.FS('readFile', 'output-' + name);
          const video = document.getElementById('output-video');
          const down = document.getElementById('down');
          const lnk = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
          video.src = lnk;
          down.href = lnk;
          down.download = 'output-'+name;
        }
        function run(){
          transcode();
        }
        const cancel = () => {
          try {
            ffmpeg.exit();
            message.innerHTML = 'Canceled';
          } catch(e) {}
          ffmpeg = null;
        }