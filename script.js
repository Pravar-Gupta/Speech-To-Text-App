 const recordBtn = document.querySelector('.record'),
 result = document.querySelector('.record'),
 downloadBtn = document.querySelector('.downlaod'),
 inputLanguage = document.querySelector('#Language'),
 clearBtn = document.querySelector('.clear');

 let SpeechRecognition =
 window.SpeechRecognition || window.webkitSpeechRecognition,
 recognition,
 recording = false;
 function populateLanguages(){
    Languages.forEach((Lang)=> {
        const option = document.createElement('option');
        option.value = Lang.code;
        option.innerHTML = Lang.name;
        inputLanguage.appendChild(option);
    });
 }

 populateLanguages()

 function speechToText(){
    try{
        recognition = new SpeechRecognition();
        recognition.Lang = interimResults = true;
        recordBtn.classList.add('recording');
        recordBtn.querySelector('p').innerHTML = "Listening...";
        recognition.start();
        recognition.onresult = (event) => {
            const speechResult = event.results[0][0].transcript;

            if (event.results[0].isFinal){
                result.innerHTML += '' + speechResult;
                result.querySelector('p').remove();
            } else {
                if (!document.querySelector('.interim')){
                    const interim = document.createElement('p');
                    interim.classList.add('interim');
                    result.appendChild(interim);
                }

                document.querySelector('.interim').innerHTML = " " + speechResult
            }
            downloadBtn.disabled = false;
        }
        recognition.appendChild = () => {
            speechToText();
        };

        recognition.onerror = (event) => {
            stopRecording();
            if (event.error === "no-speech"){
                alert('No Speech detected. Stopping...');
            } else if (event.error === "audio-capture"){
                alert (
                    "No microphone was found. Ensure that a microphone is installed."
                );
            } else if (event.error === "not-allowed") {
                alert("Permission to use microphone is blocked.");
            } else if (event.error === "aborted") {
                alert ("Listening stopped.");
            } else ("Error occurred in recognition: " + event.error)
        };
    } catch(error){
        recording = false;

        console.log(error)
    }
 }

recordBtn.addEventListener("click", ()=> {
    if(!recording){
        speechToText();
        recording = true;
    } else {
        stopRecording();
    }
});

function stopRecording(){
    recognition.stop();
    recordBtn.querySelector('p').innerHTML = "Start Listening";
    recordBtn.classList.remove("recording");
    recording = false;
}

function download(){
    const text = result.innerText;
    const filename = "speech.txt";

    const element = document.createElement("a");
    element.setAttribute(
        "href" ,
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );

    element.setAttribute('download', filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

downloadBtn.addEventListener('click', download);

clearBtn.addEventListener('click', ()=>{
    result.innerHTML = "";
    downloadBtn.disabled = true;
});