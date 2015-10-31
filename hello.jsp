<html>
	<head>
		<title>hello.jsl</title>
	</head>
	<body>
		<h1>hello</h1>
		<%
			String p = request.getParameter("p");
			if (null == p)
				p = "test strng";
				
			byte[] data = p.getBytes();
			out.println("<h1>hello world, from jsp file</h1>");	
		%>
	</body>
</html>