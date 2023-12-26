const si = require("systeminformation");
const fs = require("fs");
const path = require("path");

Promise.all([
  si.osInfo(),
  si.cpu(),
  si.mem(),
  si.memLayout(),
  si.graphics(),
  si.diskLayout(),
]).then(([osInfo, cpu, mem, memLayout, graphics, diskLayout]) => {
  let tableString = "";
  [
    {
      name: "系统信息",
      info: `${osInfo.distro} ${osInfo.kernel} ${osInfo.arch}`,
    },
    {
      name: "处理器",
      info: `${cpu.manufacturer} ${cpu.brand} ${cpu.speed}GHz ${cpu.physicalCores}核`,
    },
    {
      name: "内存",
      info: `${~~(mem.total / Math.pow(1024, 3))}GB`,
    },
    {
      name: "硬盘",
      info: `${~~(diskLayout[0].size / Math.pow(1024, 3))}GB`,
    },
  ].forEach((row) => {
    tableString += `${row.name}: ${row.info}\n`;
  });
  console.log(tableString);
  
  const filePath = "./build/system_info.txt";
  const directory = path.dirname(filePath);

  fs.mkdir(directory, { recursive: true }, (err) => {
    if (err) {
      return console.error("创建目录时出错:", err);
    }

    fs.writeFile(filePath, tableString, (err) => {
      if (err) {
        console.error("写入文件时发生错误:", err);
      } else {
        console.log("系统信息已保存到文件:", filePath);
      }
    });
  });
});
