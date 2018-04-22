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
        sessName.innerHTML = ses.name[0].toUpperCase() + ses.name.substr(1, ses.name.length) +":";

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

    for (let prop in allData) {

      let dis2mem = [];
      let dis2scr = [];
      let dis2sol = [];
      let dis2tip = [];

      if (prop !== 'properties') {
        const rawSession = allData[prop]

        if (rawSession !== '[]') {
          for (let reso of JSON.parse(rawSession)) {
            if (reso[0][1] < limit) {
              dis2mem.push(0);
              dis2sol.push(getTime(reso[0])); // time
              dis2scr.push(reso[1]); // scramble
              dis2tip.push(convertExtra(reso[0][0])); // extra (+2/DNF)
            }
          }

          let solves = {
            dis2mem: JSON.stringify(dis2mem),
            dis2scr: JSON.stringify(dis2scr),
            dis2sol: JSON.stringify(dis2sol),
            dis2tip: JSON.stringify(dis2tip),
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
