## goby扩展程序直接安装或Github下载到extensions目录下！
## 改自：ExportCsv，感谢GobySec
## github:https://github.com/i11us0ry/goby-ExportAssets

# 0x01 导出类型
1. Csv:保存为Csv文件，支持导出url、port、product
2. Txt:保存为Txt文件，支持导出url、port、product

# 0x02 导出数据
1. url:根据输入参数导出url，Csv文件保留数据格式为[url]，Txt文件保留数据格式为[url],参数如下:
    - 导出所有url:空
    - 根据port导出url:port=80,443,8000-8080,9000
    - 根据product导出url:product=Nginx,ASP

2. port:根据输入参数导出资产，Csv文件保留数据格式为[ip,port]，Txt文件保留数据格式为[ip],参数如下:
    - 不可为空
    - 根据单个port导出资产:80
    - 根据多个port导出资产:80,443,8080
    - 根据范围port导出资产:8000-8080
    - 根据综合port导出资产:80,443,8000-8080,3389  

3. product:根据输入参数导出资产，Csv文件保留数据格式为[ip,port,product]，Txt文件保留数据格式为[ip],参数如下：
    - 不可为空
    - 根据单个product导出资产:ASP
    - 根据多个product导出资产:ASP,Nginx,Apache-Tomcat

# 0x03 其他说明
1. 导出及输入product时，请严格根据goby返回资产数据输入相关参数，否则无法识别。
2. 没有做分流导出，所以数据量过大时可能会有延迟甚至失败
3. 发现bug请及时反馈，感谢

[![glZqDf.png](https://z3.ax1x.com/2021/05/06/glZqDf.png)](https://imgtu.com/i/glZqDf)
