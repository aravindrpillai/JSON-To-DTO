package json2dto

uses gw.servlet.Servlet
uses javax.servlet.http.HttpServlet
uses javax.servlet.http.HttpServletRequest
uses javax.servlet.http.HttpServletResponse
uses java.io.File
uses java.nio.file.Files
uses java.nio.file.Paths

/**
 * author : Aravind R Pillai
 * JSON TO DTO
 * Note: Add the class in servlets.xml
 */
@Servlet( \path : String ->path.matches("/create(/.*)?"))
class Json2DTO extends HttpServlet {

  override function service(req: HttpServletRequest, resp: HttpServletResponse) {
    resp.ContentType = "text/plain"
    try {
      var path = req.getParameter("path")
      var content = req.getParameter("content")
      print("Path : "+path)
      content = content.replaceAll("(?i)<br */?>","\n")
      content = content.replaceAll("&lt;","<")
      content = content.replaceAll("&gt;",">")
      content = content.replaceAll("&nbsp;","\t")
      var filename : String
      var filepath = new File(path)
      if(not filepath.exists()){
        filepath.mkdir()
      }
      foreach(cont in content.split("___NEW_CLASS______")){
        try {
          filename = cont?.split("class ")[1]?.split(" ")[0]?.trim()
          if (filename != null) {
            var file = Paths.get(path + "/" + filename + ".gs")
            Files.write(file, cont?.trim()?.Bytes)
          }
        }catch(e){
          e.printStackTrace()
        }
      }
      resp.setStatus(HttpServletResponse.SC_OK)
      resp.Writer.append("ok")
    }catch(e : Exception){
    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST)
    resp.Writer.append("failed")
    }

  }


  function isAuthenticationRequired( req: HttpServletRequest ) : boolean {
    return false
  }




}