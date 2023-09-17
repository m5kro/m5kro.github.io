function convert(){
    const userInput = document.getElementById('manualSubs').value.trim().split("\n");
    const lastTimestamp = userInput[userInput.length-1].match(/^\d{2}:\d{2}/);
    if (!lastTimestamp) {
        userInput.push('00:00');
    }
    var convertOut = '';
    var i = 1;
    var j = 0;
    do {
        try{
            convertOut += i + '\n';
            convertOut += userInput[j].padStart(8, '00:00:00') + ',000 --> ' + userInput[j+2].padStart(8, '00:00:00') + ',000\n';
            convertOut += userInput[j+1] + '\n\n';
        } catch (err){
            alert('Subtitle formating error! Please double check your subtitles!');
            ffmpeg.exit();
            message.innerHTML = 'Subtitle Error';
            return;
        }
        i++;
        j+=2;
    } while(j < userInput.length-1);
    return new Blob([convertOut], {type: 'text/srt'});
}
