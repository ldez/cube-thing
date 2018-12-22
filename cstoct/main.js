(function() {

  const ctData = document.getElementById('ct-data');

  const input = document.getElementById('csTimerFile');
  input.addEventListener('change', submitNow);

  const filedrag = document.getElementById('filedrag');
  filedrag.addEventListener('drop', submitNow, false);
  filedrag.addEventListener('dragover', stopEvent);
  filedrag.addEventListener('dragleave', stopEvent);

  function stopEvent(evt) {
    evt.stopPropagation(); // Stops some browsers from redirecting.
    evt.preventDefault();

    if (evt.type == "dragover") {
      evt.target.classList.add("filedrag_hover");
    } else {
      evt.target.classList.remove("filedrag_hover");
    }
  }

  function submitNow(evt) {
    stopEvent(evt);

    let file;
    if (evt.dataTransfer) {
      file = evt.dataTransfer.files[0];
    } else {
      file = evt.currentTarget.files[0];
    }

    ctData.innerHTML = '';
    const limitInput = document.getElementById('limit');

    const reader = new FileReader();
    reader.onload = displayConvertion(parseInt(limitInput.value, 10));
    reader.readAsText(file);
  }

  function displayConvertion(theLimit) {
    return function(e) {
      const sessions = convert(JSON.parse(e.target.result), theLimit);

      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');

      for (let ses of sessions) {
        const area = document.createElement('textarea');
        area.readOnly = true;
        area.classList.add('content');
        area.value = ses.data;

        const sessName = document.createElement('span');
        sessName.classList.add('session-name');
        sessName.innerHTML = ses.name[0].toUpperCase() + ses.name.substr(1, ses.name.length) + ":";

        const section = document.createElement('div');
        section.appendChild(sessName);
        section.appendChild(area);

        wrapper.appendChild(section);
        ctData.appendChild(wrapper);
      }
    }
  }

  // Convert data from CSTimer to Cubing Time format.
  function convert(allData, limit) {
    const allSessions = [];

    const sessionData = JSON.parse(JSON.parse(allData.properties).sessionData);


    let sessionIndex = 0
    for (let prop in allData) {

      let dismem = [];
      let disscr = [];
      let dissol = [];
      let distip = [];

      if (prop !== 'properties') {
        sessionIndex++
        const rawSession = allData[prop]

        if (rawSession !== '[]') {
          for (let reso of JSON.parse(rawSession)) {
            if (reso[0][1] < limit) {
              dismem.push(0);
              dissol.push(getTime(reso[0])); // time
              disscr.push(reso[1]); // scramble
              distip.push(convertExtra(reso[0][0])); // extra (+2/DNF)
            }
          }

          let rawSolves = {
            dismem: JSON.stringify(dismem),
            disscr: JSON.stringify(disscr),
            dissol: JSON.stringify(dissol),
            distip: JSON.stringify(distip),
          }

          const scrType = sessionData['' + sessionIndex].scr;

          let solves = {}
          if (scrType.startsWith("222")) {
            solves = {
              dis1mem: rawSolves.dismem,
              dis1scr: rawSolves.disscr,
              dis1sol: rawSolves.dissol,
              dis1tip: rawSolves.distip,
            }
          } else if (scrType.startsWith("333")) {
            solves = {
              dis2mem: rawSolves.dismem,
              dis2scr: rawSolves.disscr,
              dis2sol: rawSolves.dissol,
              dis2tip: rawSolves.distip,
            }
          } else if (scrType.startsWith("444")) {
            solves = {
              dis3mem: rawSolves.dismem,
              dis3scr: rawSolves.disscr,
              dis3sol: rawSolves.dissol,
              dis3tip: rawSolves.distip,
            }
          } else if (scrType.startsWith("555")) {
            solves = {
              dis4mem: rawSolves.dismem,
              dis4scr: rawSolves.disscr,
              dis4sol: rawSolves.dissol,
              dis4tip: rawSolves.distip,
            }
          } else if (scrType.startsWith("666")) {
            solves = {
              dis5mem: rawSolves.dismem,
              dis5scr: rawSolves.disscr,
              dis5sol: rawSolves.dissol,
              dis5tip: rawSolves.distip,
            }
          } else if (scrType.startsWith("777")) {
            solves = {
              dis6mem: rawSolves.dismem,
              dis6scr: rawSolves.disscr,
              dis6sol: rawSolves.dissol,
              dis6tip: rawSolves.distip,
            }
          } else {
            solves = rawSolves;
          }

          allSessions.push({
            name: prop,
            data: JSON.stringify(solves, ' ', 2)
          });
        }
      }
    }

    return allSessions;
  }

  function getTime(resoData) {
    if (resoData[0] === -1) {
      return Math.floor(resoData[1] / 10)
    }
    return Math.floor((resoData[1] + resoData[0]) / 10)
  }

  // cstimer:
  // 20000 -> +2
  // -1 -> DNF
  //
  // Cubing Time
  // dis2tip:
  // 1 -> +2
  // 4 -> DNF
  function convertExtra(csValue) {
    switch (csValue) {
      case 2000:
        return 1;
      case -1:
        return 4;
      case 0:
        return 0;
      default:
        console.log('Invalid value:', csValue);
        return 0;
    }
  }

})();
