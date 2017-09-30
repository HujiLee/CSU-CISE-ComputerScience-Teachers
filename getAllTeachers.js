var request = require("request");
var fs = require("fs");
request.post("http://202.197.61.251/sisehr/teacherInfo/getAll.do").pipe(
    fs.createWriteStream("teachers.json")
).on("close", (a, b, c) => {
    var teachers = require("./teachers.json");
    var csteachers = teachers.filter((ele, index) => {
        return ele['com'] && ele['com']['companyname'] == "计算机科学与技术系";
    });
    csteachers.forEach((ele) => {
        console.log(ele.id, ele.name);
    });
    var lognames = csteachers.map((ele) => {
        return ele.logname
    })
    lognames.forEach((logname) => {
        request.post({
            url: "http://202.197.61.251/sisehr/teacherInfo/getByLogname.do",
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            }
        }, function (err, httpRes, body) {
            if (err) {

            } else {
                var teacherSingleInfo = JSON.parse(body);
                var str = ""
                for (let key in teacherSingleInfo) {
                    if (teacherSingleInfo[key]) {
                        str += ">>>"+key + "\n" + teacherSingleInfo[key]+"\n------\n"
                    }
                }
                str = str.replace(/<br\/>/g,"\n");
                fs.writeFile("./"+teacherSingleInfo['name'] + ".txt", str, function (err) {
                    if (err) {
                        debugger
                    }
                })
            }
        }).form({
            logname
        })
    })
})