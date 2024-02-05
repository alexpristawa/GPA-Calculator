const root = document.querySelector(':root');
const body = document.querySelector('body');
const html = document.documentElement;
const classesHolder = document.getElementById('classesHolder');
const holder45Scale = document.getElementById('holder45Scale');
const moreInfoDiv = document.querySelector('.moreInfoDiv');
moreInfoDiv.style.display = 'none';
const gpa40Scale = document.getElementById('display40Scale');
const totalCreditNumber = document.getElementById('totalCreditNumber');
const settingsButton = document.getElementById('settingsButton');
const settingsDiv = document.querySelector('.settingsDiv');
let moreInfoButton = document.getElementById('moreInfoButton');
let activeGrade = 9;
let info;
let previousLocalStorage = JSON.parse(localStorage.gpaCalculator);
if(previousLocalStorage !== undefined) {
    info = previousLocalStorage.info;
} else {
    info = {
        9: [],
        10: [],
        11: [],
        12: []
    }
    localStorage['gpaCalculator'] = JSON.stringify({info: info});
}

window.onload = () => {
    for(let i = 0; i < info[9].length; i++) {
        newClass(info[9][i], true);
    }
    newClass(undefined, true);
    addClassButton();
}

window.onresize = () => {
    const fontSize = (window.innerHeight * window.innerWidth) / 65970;
    const minFontSize = 9; // set your desired minimum font size here
    html.style.fontSize = `${Math.max(fontSize, minFontSize)}px`;
}

  

{
    let gradeTabs = document.querySelectorAll('#gradesHolder > div');
    let tabNumberOG = 9;
    gradeTabs.forEach(tab => {
        const tabNumber = tabNumberOG;
        tab.addEventListener('click', () => {
            save();
            activeGrade = tabNumber;
            classesHolder.innerHTML = '';
            for(let i = 0; i < gradeTabs.length; i++) {
                if(gradeTabs[i] != tab) {
                    gradeTabs[i].style.borderRadius = '0px';
                    gradeTabs[i].style.height = '100%';
                    gradeTabs[i].style.marginTop = '0px';
                    gradeTabs[i].querySelector('p').style.fontSize = '1.7rem';
                    if(i == 0) {
                        gradeTabs[i].style.borderTopLeftRadius = '2vh';
                    } else if(i == 3) {
                        gradeTabs[i].style.borderTopRightRadius = '2vh';
                    }
                }
            }
            tab.style.borderTopLeftRadius = '2vh';
            tab.style.borderTopRightRadius = '2vh';
            tab.style.height = 'calc(100% + 2vh)';
            tab.style.marginTop = '-2vh';
            tab.querySelector('p').style.fontSize = '2.3rem';
            document.getElementById('infoHolder').style.backgroundColor = `var(--grade${tabNumber}Color)`;
            moreInfoButton.style.backgroundColor = `var(--grade${tabNumber}Color)`;
            holder45Scale.style.backgroundColor = `var(--grade${tabNumber}Color)`;
            for(let i = 0; i < info[tabNumber].length; i++) {
                newClass(info[tabNumber][i], true);
            }
            newClass(undefined,true);
            addClassButton();
        });
        tabNumberOG++;
    });
}

let newClass = (obj, makeHR) => {
    if(makeHR && document.querySelectorAll('.classHolder').length != 0) {
        let hr = document.createElement('hr');
        hr.classList.add('classSeparator');
        classesHolder.appendChild(hr);
    }
    let div = document.createElement('div');
    div.classList.add('classHolder');
    classesHolder.appendChild(div);

    let className = document.createElement('input');
    className.setAttribute('type', 'text');
    className.classList.add('className');
    className.classList.add('filterName');
    if(obj) {
        className.value = obj['Class Name'];
    }
    className.placeholder = 'Class Name';
    className.style.textAlign = 'start';
    div.appendChild(className);

    let weight = document.createElement('select');
    weight.classList.add('weight');
    {
        let option1 = document.createElement('option');
        option1.text = 'CP1';
        weight.add(option1);

        let option2 = document.createElement('option');
        option2.text = 'Honors';
        weight.add(option2);

        let option3 = document.createElement('option');
        option3.text = 'AP';
        weight.add(option3);
    }
    if(obj) {
        weight.value = obj['Weight'];
    }
    div.appendChild(weight);

    let grade = document.createElement('input');
    grade.setAttribute('type', 'text');
    grade.classList.add('classNumber');
    if(obj) {
        grade.value = obj['Grade'];
    }
    grade.placeholder = 'Grade (%)';
    grade.classList.add('filterGrade');
    div.appendChild(grade);

    let credits = document.createElement('input');
    credits.setAttribute('type', 'text');
    credits.classList.add('classNumber');
    if(obj) {
        credits.value = obj['Credits'];
    }
    credits.placeholder = 'Credits';
    credits.classList.add('filterCredits');
    div.appendChild(credits);

    let x = document.createElement('button');
    x.innerHTML = '&times;';
    x.classList.add('xButtons');
    div.appendChild(x);
    x.addEventListener('mousedown', () => {
        root.style.setProperty('--slideDownDistance', `-${div.offsetHeight + 13}px`);
        let classesHolderStuff = document.querySelectorAll('#classesHolder > *');
        let go = false;
        classesHolderStuff.forEach(element => {
            if(go) {
                element.style.animation = 'slideDown 0.2s ease-in-out';
                setTimeout(() => {
                    element.style.animation = '';
                },200);
            } else if(element == div) {
                go = true;
                element.style.animation = 'slideDownAndFade 0.2s ease-in-out';
            }
        });
        for(let i = 0; i < classesHolderStuff.length; i++) {
            if(div == classesHolderStuff[i]) {
                setTimeout(() => {
                    classesHolderStuff[i+1].remove();
                    div.remove();
                },200);
                break;
            }
        }
    });
}

let addClassButton = () => {
    let hr = document.createElement('hr');
    hr.classList.add('classSeparator');
    classesHolder.appendChild(hr);

    let div = document.createElement('div');
    div.classList.add('addClassHolder');
    div.style.animation = 'fadeIn 0.2s ease-in-out';
    classesHolder.appendChild(div);

    let name = document.createElement('p');
    name.classList.add('addClassP');
    name.innerHTML = 'Add Class';
    div.appendChild(name);

    div.addEventListener('click', () => {
        const rect = div.getBoundingClientRect();
        let x = rect.left;
        let y = rect.top;
        div.style.width = `${div.offsetWidth}px`;
        div.style.height = `${div.offsetHeight}px`;
        div.querySelector('p').style.marginLeft = '-1.5vh';
        classesHolder.removeChild(div);
        newClass();
        body.appendChild(div);
        div.style.position = 'absolute';
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.animation = 'fadeOut 0.2s ease-in-out';
        setTimeout(() => {
            div.remove();
        },200);
        addClassButton();
        classesHolder.scrollTop = classesHolder.scrollHeight;
    });
}

window.addEventListener('beforeunload', function(event) {
    save();
});

let save = () => {
    info[activeGrade] = [];
    let divs = document.querySelectorAll('.classHolder');
    for(let i = 0; i < divs.length; i++) {
        let name = divs[i].querySelector('.filterName').value;
        let weight = divs[i].querySelector('.weight').value;
        let grade = divs[i].querySelector('.filterGrade').value;
        let credits = divs[i].querySelector('.filterCredits').value;
        if(!(name == '' && grade == '' && credits == '')) {
            info[activeGrade].push({
                'Class Name': name,
                'Weight': weight,
                'Grade': parseInt(grade),
                'Credits': parseFloat(credits)
            });
        }
    }
    localStorage['gpaCalculator'] = JSON.stringify({info: info});
}

let calculate = () => {
    save();

    let spliced = 0;
    let qualityPoints = 0;
    let credits = 0;
    for(let i = 9; i < 13; i++) {
        for(let j = 0; j < info[i].length; j++) {
            if(typeof info[i][j]['Grade'] !== 'number' || typeof info[i][j]['Credits'] !== 'number' || isNaN(info[i][j]['Grade']) || isNaN(info[i][j]['Credits'])) {
                spliced++;
            } else {
                let placement = info[i][j]['Weight'];
                let grade = info[i][j]['Grade'];
                let newCredits = info[i][j]['Credits'];
                if(placement == 'CP1') {
                    qualityPoints += (4 - (0.038 * (100-grade)))*newCredits;
                } else if(placement == 'Honors') {
                    qualityPoints += (4.5 - (0.043 * (100-grade)))*newCredits;
                    //qualityPoints += (4 - (0.038 * (100-grade)))*1.0625*newCredits;
                } else if(placement == 'AP') {
                    qualityPoints += (5 - (0.048 * (100-grade)))*newCredits;
                    //qualityPoints += (4 - (0.038 * (100-grade)))*1.125*newCredits;
                }
                credits += newCredits;
            }
        }
    }
    if(credits != 0) {
        let GPA = qualityPoints/credits;
        let gpa45Scale = document.getElementById('display45Scale');
        gpa45Scale.innerHTML = GPA.toFixed(4);
        gpa40Scale.innerHTML = (GPA/4.5*4).toFixed(4);
        totalCreditNumber.innerHTML = credits;
    }

    if(spliced > 0) {
        discardedAlert(spliced);
    }
}

let discardedAlert = (num) => {
    let div = document.createElement('div');
    div.classList.add('discardedDiv');
    setTimeout(() => {
        div.style.animation = 'fadeOut 0.5s ease-in-out';
        setTimeout(() => {
            div.remove();
        },500);
    },4500);
    body.appendChild(div);

    let p = document.createElement('p');
    p.classList.add('discardedP');
    if(num == 1) {
        p.innerHTML = `1 class was discarded because the inputs in either the "credits" or "grade" section weren't valid.`;
    } else {
        p.innerHTML = `${num} classes were discarded because the inputs in either the "credits" or "grade" section weren't valid.`;
    }
    div.appendChild(p);
}

let moreInfo = () => {
    if(moreInfoDiv.style.display == 'none') {
        moreInfoDiv.style.display = 'flex';
        moreInfoDiv.style.animation = '';
        setTimeout(() => {
            moreInfoDiv.style.animation = 'fadeIn 0.2s ease-in-out';
        });
    } else {
        moreInfoDiv.style.animation = '';
        setTimeout(() => {
            moreInfoDiv.style.animation = 'fadeOut 0.2s ease-in-out';
            setTimeout(() => {
                moreInfoDiv.style.display = 'none';
            },200);
        });
    }
}

document.addEventListener('keydown', (event) => {
    if(event.key == 'w') {
        console.log(info);
    }
});

let howTo = () => {
    if(document.querySelectorAll('.howToDiv').length != 0) {
        let div = document.querySelector('.howToDiv');
        div.classList.remove('grow');
        setTimeout(() => {
            div.classList.add('shrink');
            setTimeout(() => {
                div.remove();
            },300);
        });
        return;
    }
    let div = document.createElement('div');
    div.classList.add('howToDiv');
    div.classList.add('grow');
    body.appendChild(div);

    let title = document.createElement('p');
    title.classList.add('howToTitle');
    title.innerHTML = 'Info';
    div.appendChild(title);

    let div1 = document.createElement('div');
    div1.classList.add('howToDiv1');
    div.appendChild(div1);
    
    let div1x1 = document.createElement('div');
    div1x1.classList.add('howToDiv1x1');
    div1.appendChild(div1x1);

    let div1x2 = document.createElement('div');
    div1x2.classList.add('howToDiv1x2');
    div1.appendChild(div1x2);

    let howToUseTitle = document.createElement('p');
    howToUseTitle.classList.add('howToUseTitle');
    howToUseTitle.innerHTML = 'How to Use';
    div1x1.appendChild(howToUseTitle);

    let howToUseText = document.createElement('p');
    howToUseText.classList.add('howToUseText');
    howToUseText.innerHTML = 
    `
    Fill out the corresponding information for each of your <u>weighted</u> classes<br>
    (Class name is not a necessary part of the calculation.)<br><br>

    If you are only at midterm for the current year, each class this year should count as 0.5 credits.<br><br>

    BHS uses the 4.5 scale for GPA, but colleges commonly use the 4.0 scale. If you want to see your 4.0 scale GPA, click "More Info" and "Calculate"<br><br>

    If you are unsure of the weights of your classes, check them in the program of studies: <a href='https://drive.google.com/drive/folders/1JAikx7BOLYi14AGvAanbCbztTxdYHeUp?usp=sharing' target="_blank"><em>Program of Studies Folder</em></a>
    `;
    div1x1.appendChild(howToUseText);
    
    let div2 = document.createElement('div');
    div2.classList.add('howToDiv2');
    div.appendChild(div2);

    let privacyText = document.createElement('p');
    privacyText.classList.add('howToPrivacyText');
    privacyText.innerHTML = 
    `
    It is necessary to explain that all information is stored locally on your device, and none of the data is collected in any way. The benefit of having local storage enabled is that you don't have to retype old information every time you want to find your GPA. If you want to disable this feature, you can in settings.
    `;
    div2.appendChild(privacyText);
}

let settings = () => {
    if(settingsDiv.classList.contains('slideFromRight')) {
        settingsDiv.classList.remove('slideFromRight');
        let icon = settingsButton.querySelector('i');
        icon.classList.remove('rotateN180');
        icon.classList.remove('rotate180');
        setTimeout(() => {
            settingsDiv.classList.add('slideToRight');
            icon.classList.add('rotateN180');
        });
    } else {
        let icon = settingsButton.querySelector('i');
        icon.classList.remove('rotateN180');
        icon.classList.remove('rotate180');
        settingsDiv.classList.remove('slideToRight');
        setTimeout(() => {
            settingsDiv.classList.add('slideFromRight');
            icon.classList.add('rotate180');
        });
    }
}