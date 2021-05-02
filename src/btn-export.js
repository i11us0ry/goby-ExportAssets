let goby = parent.goby; // 获取GobyAPi
// 导出csv
$(".export-csv").on("click", function() {
  //getAsset 获取当前任务的所有资产数据(taskid,资产数据的回调函数)
  goby.getAsset(goby.getTaskId(), getAsset2Csv);
})

$(".export-txt").on("click", function() {
  //getAsset 获取当前任务的所有资产数据(taskid,资产数据的回调函数)
  goby.getAsset(goby.getTaskId(), getAsset2Txt);
})

// 检测导出数据
function check_submit(){
  let radio_value = $(".choose-radio")
  // 遍历单选按钮，确定导出数据
  for(let i = 0;i<radio_value.length;i++){
    if(radio_value[i].checked){
      // 选择导出url，则直接返回url
      if (radio_value[i].value == "Url"){
        let input = $(".search-input").val();
        let por_or_pro = get_por_or_pro(input)
        return por_or_pro
      }
      // 选择导出port，则返回处理过后的port
      else if (radio_value[i].value == "Port") {
        let input = $(".search-input").val();
        let ports = get_Ports(input)
        let result = ["Port",ports]
        return result
      }
      // 选择导出Product，则返回处理过后的Product
      else if (radio_value[i].value == "Product") {
        let input = $(".search-input").val();
        let products = get_Products(input)
        let result = ["Product",products]
        return result
      }
    }
  }
}

// 处理 url 的参数
function get_por_or_pro(por_or_pro){
  // 如果参数为空则返回1，导出所有url
  if (!por_or_pro){
    return ["Url",1]
  } else if(por_or_pro.indexOf("=")!=-1){
    por_or_pro = por_or_pro.split("=")
    // 如果输入port，则处理ports
    if (por_or_pro[0]=="port"){
      let ports = get_Ports(por_or_pro[1])
      return ["Url","port",ports]
    } else if (por_or_pro[0]=="product"){
      let products = get_Products(por_or_pro[1])
      return ["Url","product",products]
    } else {
      goby.showErrorMessage("只支持空值或port、product！");
      return ["Url",0]
    }
  } else {
    goby.showErrorMessage("只支持空值或port、product！");
    return ["Url",0]
  }
}

// 处理 ports
function get_Ports(ports){
  // 获取输入框的值
  let ports_list = [];
  // 如过输入框为空则返回0
  if (!ports){
    return 0
  } else if (ports.indexOf(",")!=-1){
    // 优先检测是否存在",",若存在则拆分
    ports = ports.split(",")
    for (let i=0,len=ports.length;i<len;i++){
       // 检测是否存在"-",若存在则拆分
      if (ports[i].indexOf("-")!=-1){
        ports[i] = ports[i].split("-")
        for (let j=ports[i][0];j<=ports[i][1];j++){
          ports_list.push(j.toString())
        }
      } else{
        ports_list.push(ports[i].toString())
      }
    }
  }
    // 检测是否存在"-"
    else if(ports.indexOf("-")!=-1){
      ports = ports.split("-")
      for (let j=ports[0];j<=ports[1];j++){
            ports_list.push(j.toString())
      }
    }
    else if(0<=ports && ports<=65535){
      ports_list.push(ports)
    }
  return ports_list
}

// 处理 products
function get_Products(products){
  // 获取输入框的值
  let products_list = [];
  // 如过输入框为空则返回0
  if (!products){
    return 0
  } else if (products.indexOf(",")!=-1){
    // 检测是否存在",",若存在则拆分
    products = products.split(",")
    for (let i=0,len=products.length;i<len;i++){
      products_list.push(products[i])
    } 
  } else {
      products_list.push(products)
    }
  return products_list
}


// 输出为Csv
function getAsset2Csv(data) {
  let assets_field = []
  let fields = []
  let opts = {}
  // 资产状态码，200为正常
  if (data.statusCode == 200) {
    // 检测导出数据
    let result = check_submit()
    if (!result){
      // 如果没有选择导出数据
      goby.showErrorMessage("请选择导出数据:url、port或product！");
    } else if(result[0] == "Url"){
      // 返回值为0说明参数错误
      if (result[1]==0){
        console.log("url参数错误！")
      } else {
        ips = data.data.ips
        for (let ips_index=0,iplen=ips.length;ips_index<iplen;ips_index++){
          protocols = ips[ips_index]["protocols"]
          for (let pkey in protocols){
            if (pkey){
              protocols_Val = protocols[pkey]
              is_http = protocols_Val["protocol"]
              if (result[1]==1){
                fields = ["url"];
                opts = { fields };
            // 返回值为1说明导出全部url
                if (is_http=="http"){
                    // 若为http，则进行url拼接，并返回url
                    url = "http://"+protocols_Val["hostinfo"]
                    let asset= {
                      "url":url
                    }
                    assets_field.push(asset)
                  } else if(is_http=="https"){
                    // 若为https，则返回url
                    url = protocols_Val["url"]
                    let asset= {
                      "url":url
                    }
                    assets_field.push(asset)
                  }
              } else if(result[1]=="port"){
                fields = ["url"];
                opts = { fields };
                let port = protocols_Val["port"]
                if (result[2].indexOf(port)!=-1){
                  if (is_http=="http"){
                    // 若为http，则进行url拼接，并返回url
                    url = "http://"+protocols_Val["hostinfo"]
                    let asset= {
                      "url":url
                    }
                    assets_field.push(asset)
                  } else if(is_http=="https"){
                    // 若为https，则返回url
                    url = protocols_Val["url"]
                    let asset= {
                      "url":url
                    }
                    assets_field.push(asset)
                  }
                }
              } else if(result[1]=="product"){
                fields = ["url","product"];
                opts = { fields };
                let products = protocols_Val["products"]
                if (products[0]!=""){
                  for (let i=0,len=products.length;i<len;i++){
                  // 判断当前product是否在用户输入的products范围内，如果是，则添加到assets_field
                    if (result[2].indexOf(products[i])!=-1){
                      if (is_http=="http"){
                        // 若为http，则进行url拼接，并返回url
                        url = "http://"+protocols_Val["hostinfo"]
                        let asset= {
                          "url":url,
                          "product":products[i]
                        }
                        assets_field.push(asset)
                      } else if(is_http=="https"){
                        // 若为https，则返回url
                        url = protocols_Val["url"]
                        let asset= {
                          "url":url,
                          "product":products[i]
                        }
                        assets_field.push(asset)
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }
  } else if(result[0] == "Port"){
    // 选择了根据port导出
    if (result[1]!=0){
      fields = ["ip","port"];
      opts = { fields };
      ips = data.data.ips
      for (let i=0,len=ips.length;i<len;i++){
        protocols = ips[i]["protocols"]
        ip = ips[i]["ip"]
        for (let pkey in protocols){
          if (pkey){
            protocols_Val = protocols[pkey]
            port = protocols_Val["port"]
            if (result[1].indexOf(port)!=-1){
              let asset= {
                  "ip":ip,
                  "port":port
              }
              assets_field.push(asset)
            }
          }
        }
      }
    } else {
      goby.showErrorMessage("请输入导出参数或检查参数是否有误！");
    }
  } else if(result[0] == "Product"){
    // 选择了根据Product导出
    if (result[1]!=0){
      fields = ["ip","Port","Product"];
      opts = { fields };
      ips = data.data.ips
      for (let i=0,len=ips.length;i<len;i++){
        protocols = ips[i]["protocols"]
        ip = ips[i]["ip"]
        for (let pkey in protocols){
          if (pkey){
            protocols_Val = protocols[pkey]
            port = protocols_Val["port"]
            products = protocols_Val["products"]
            if (products[0]!=""){
              // 遍历products
              for (let j=0,len=products.length;j<len;j++){
                // 判断当前product是否在用户输入的products范围内，如果是，则添加到assets_field
                if (result[1].indexOf(products[j])!=-1){
                  let asset= {
                    "ip":ip,
                    "Port":port,
                    "Product":products[j]
                  }
                  assets_field.push(asset)
                }
              }
            }
          }
        }
      }
    } else {
      goby.showErrorMessage("请输入导出参数或检查参数是否有误！");
    }
  }
  if (assets_field.length!=0){
    try {
      const parser = new json2csv.Parser(opts);
      const csv = parser.parse(assets_field);
      let csvContent = "data:text/csv;charset=utf-8,\ufeff" + csv;
      let name = goby.getTaskId()+".csv";
      let encodedUri = encodeURI(csvContent);
      let link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      goby.closeIframeDia();
      goby.showInformationMessage("导出成功！");
    } catch (err) {
      goby.showErrorMessage(err);
    } 
  } else {
    console.log("要导出的资产为空！");
  }
} else {
    goby.showErrorMessage(data.messages);
  }
}

// 输出为TXT
function getAsset2Txt(data) {
  let assets_field = []
  // 资产状态码，200为正常
  if (data.statusCode == 200) {
    // 检测导出数据
    let result = check_submit()
    if (!result){
      // 如果没有选择导出数据
      console.log("err")
    } else if(result[0] == "Url"){
      // 返回值为0说明参数错误
      if (result[1]==0){
        console.log("url参数错误！")
      } else {
        ips = data.data.ips
        for (let i=0,len=ips.length;i<len;i++){
          protocols = ips[i]["protocols"]
          for (let pkey in protocols){
            if (pkey){
              protocols_Val = protocols[pkey]
              is_http = protocols_Val["protocol"]
              if (result[1]==1){
            // 返回值为1说明导出全部url
                if (is_http=="http"){
                    // 若为http，则进行url拼接，并返回url
                    url = "http://"+protocols_Val["hostinfo"]
                    let asset= {
                      "Url":url
                    }
                    assets_field.push(asset)
                  } else if(is_http=="https"){
                    // 若为https，则返回url
                    url = protocols_Val["url"]
                    let asset= {
                      "Url":url
                    }
                    assets_field.push(asset)
                  }
              } else if(result[1]=="port"){
                fields = ["url"];
                opts = { fields };
                let port = protocols_Val["port"]
                if (result[2].indexOf(port)!=-1){
                  if (is_http=="http"){
                    // 若为http，则进行url拼接，并返回url
                    url = "http://"+protocols_Val["hostinfo"]
                    let asset= {
                      "Url":url
                    }
                    assets_field.push(asset)
                  } else if(is_http=="https"){
                    // 若为https，则返回url
                    url = protocols_Val["url"]
                    let asset= {
                      "Url":url
                    }
                    assets_field.push(asset)
                  }
                }
              } else if(result[1]=="product"){
                fields = ["url"];
                opts = { fields };
                let products = protocols_Val["products"]
                if (products[0]!=""){
                  for (let j=0,len1=products.length;j<len1;j++){
                  // 判断当前product是否在用户输入的products范围内，如果是，则添加到assets_field
                    if (result[2].indexOf(products[j])!=-1){
                      if (is_http=="http"){
                        // 若为http，则进行url拼接，并返回url
                        url = "http://"+protocols_Val["hostinfo"]
                        let asset= {
                          "Url":url,
                        }
                        assets_field.push(asset)
                      } else if(is_http=="https"){
                        // 若为https，则返回url
                        url = protocols_Val["url"]
                        let asset= {
                          "Url":url,
                        }
                        assets_field.push(asset)
                      }
                    }
                  }
                }
              }
            }
          }
        }
    }
  } else if(result[0] == "Port"){
    if (result[1]!=0){
      ips = data.data.ips
      for (let i=0,len=ips.length;i<len;i++){
        protocols = ips[i]["protocols"]
        ip = ips[i]["ip"]
        for (let pkey in protocols){
          if (pkey){
            protocols_Val = protocols[pkey]
            port = protocols_Val["port"]
            if (result[1].indexOf(port)!=-1){
              let asset= {
                  "Url":ip,
              }
              assets_field.push(asset)
            }
          }
        }
      }
    }
  } else if(result[0] == "Product"){
    if (result[1]!=0){
      ips = data.data.ips
      for (let i=0,len=ips.length;i<len;i++){
        protocols = ips[i]["protocols"]
        ip = ips[i]["ip"]
        flag = 0
        for (let pkey in protocols){
          if (pkey){
            protocols_Val = protocols[pkey]
            products = protocols_Val["products"]
            if (products[0]!=""){
              // 遍历products
              for (let j=0,len1=products.length;j<len1;j++){
                // 判断当前product是否在用户输入的products范围内，如果是，则添加到assets_field
                if (result[1].indexOf(products[j])!=-1 && flag==0){
                  flag = 1
                  console.log(products,ip,result[1])
                  let asset= {
                    "Url":ip
                  }
                  assets_field.push(asset)
                }
              }
            }
          }
        }
      }
    }
  }
  if (assets_field.length!=0){
    try {
      console.log("assets_field.length",assets_field.length)
      let fileName = goby.getTaskId()+".txt";
      const parser = new json2txt(assets_field,fileName);
      goby.closeIframeDia();
      goby.showInformationMessage("导出成功！");
    } catch (err) {
      goby.showErrorMessage(err);
    } 
  } else {
    goby.showErrorMessage("要导出的资产为空！请确定参数是否输入正确！");
  }
} else {
    goby.showErrorMessage(data.messages);
  }
}
