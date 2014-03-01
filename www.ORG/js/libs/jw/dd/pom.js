function DateToJulianDayNumber(day, month, year)
{
    var jd, x, d1, m1, y1;
    var d2, m2, y2;

    d2 = day;
    m2 = month;
    y2 = year;

    if (y2 == 1582) {
        if (m2 == 10) {
            if (d2 > 4 && d2 < 15)
                d2 = 15;
        }
    }

    d1 = d2;
    m1 = m2;
    y1 = y2;

    x = 12 * (y1 + 4800) + m1 - 3;
    jd = (2 * (x - Math.floor(x / 12) * 12) + 7 + (365 * x)) / 12;
    jd = Math.floor(jd) + d1 + Math.floor(x / 48) - 32083;

    if (jd > 2299170)
        jd = jd + Math.floor(x / 4800) - Math.floor(x / 1200) + 38;

    return (jd);
}

// utility routines for lunar computation
function DEGTORAD(deg) {
    return deg / 57.29578;
}
function RADTODEG(rad) {
    return rad * 57.29578;
}
function scale360(D) {
    while (D > 360)
        D -= 360;
    return(D);
}

function AgeOfMoon() {
    // ecliptic longitude of sun at epoch 1/1/1980
    var EPSSOL = 278.833540;
    // ecliptic longitude of sun perigee at epoch
    var PERIGEE = 282.596403;
    var _360divPItimesE = 1.9157432;

    // mean longitude of moon at epoch
    L0 = 64.975464;
    // mean longitude of perigee at epoch
    P0 = 349.383063;
    // mean longitude of node at epoch
    N0 = 151.950429;

    var MSoldeg, MSolsin, D, N, Ec, LongSol, LongLun, MLun, Ev, Ae, V, A4, age, phase;

    // get number of days relative to january 1980
    var jdnepoch = DateToJulianDayNumber(1, 1, 1980);
    // todays' date
    var today = new Date();
    var msec = today.getUTCMilliseconds();
    var sec = today.getUTCSeconds();
    var minute = today.getUTCMinutes();
    var hour = today.getUTCHours();
    var day = today.getUTCDate();
    var month = today.getUTCMonth();
    var year = today.getUTCFullYear();
    var jdntoday = DateToJulianDayNumber(day, month, year);
    D = jdntoday - jdnepoch;
    N = (360.0 / 365.2422) * D;
    // add fractional days
    D += (hour / 24.0) +
            (minute / 1440.0) +
            (sec / 86400.0) +
            (msec / 86400000.0);

    MSoldeg = N + EPSSOL - PERIGEE;
    MSoldeg = scale360(MSoldeg);
    MSolsin = Math.sin(DEGTORAD(MSoldeg));
    Ec = _360divPItimesE * MSolsin;
    LongSol = N + Ec + EPSSOL;
    LongSol = scale360(LongSol);
    LongLun = (13.176396 * D) + L0;
    LongLun = scale360(LongLun);
    MLun = LongLun - (0.1114041 * D) - P0;
    MLun = scale360(MLun);
    N = N0 - (0.0529539 * D);
    N = scale360(N);
    Ev = 1.2739 * Math.sin(DEGTORAD(2 * (LongLun - LongSol) - MLun));
    // calculate the corrected anomoly
    Ae = (0.1858 * MSolsin);
    MLun += Ev - Ae - (0.37 * MSolsin);
    Ec = (6.2886) * Math.sin(DEGTORAD(MLun));
    A4 = (0.214) * Math.sin(DEGTORAD(2 * MLun));
    LongLun += Ev + Ec - Ae + A4;
    V = (0.6583) * Math.sin(DEGTORAD((2.0) * (LongLun - LongSol)));
    LongLun += V;
    age = LongLun - LongSol;
    age = scale360(age);
    return(age);
}

// given age of moon return the current phase
function PhaseOfMoon(age)
{
    return ((1.0) - Math.cos(DEGTORAD(age))) / 2.0;
}

function OutputCurrentUTC() {
    var today = new Date();
    mon = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var msec = today.getUTCMilliseconds();
    var sec = today.getUTCSeconds();
    sec += msec / 1000.0;
    var minute = today.getUTCMinutes();
    var hour = today.getUTCHours();
    var day = today.getUTCDate();
    var month = today.getUTCMonth();
    var year = today.getUTCFullYear();
    document.write(mon[month] + " " + day + ", " + year + " "
            + hour + ":" + minute + ":" + sec);
}

function OutputLocalTime() {
    var mon, day, now, hour, min, ampm, time, str, tz, end, beg;
    mon = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    day = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
    d = new Date();
    sss = Math.round(d.getTime() / 1000);
    now = new Date(sss * 1000);
    hour = now.getHours();
    min = now.getMinutes();
    sec = now.getSeconds();
    ampm = (hour >= 12) ? "pm" : "am";
    hour = (hour == 0) ? 12 : (hour > 12) ? hour - 12 : hour;
    min = (min < 10) ? "0" + min : min;
    tz = "";
    time = hour + ":" + min + ":" + sec + ampm + tz +
            ", " + day[now.getDay()] +
            " " + mon[now.getMonth()] +
            " " + now.getDate() +
            ", " + now.getFullYear();
    document.write("Local time is " + time);
}
