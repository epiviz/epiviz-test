<!--<?php
?>-->
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <link href="css/main.css" rel="stylesheet" />

    <script src="src/lib/jquery/jquery-1.8.2.js"></script>

    <!-- Google Closure -->
    <script src="src/closure/goog/base.js"></script>
    <script src="src/closure/goog/structs/collection.js"></script>

    <script>
      $(function() {
        $('.left').load(function(){
          //$($(this).contents()[0])
        });
      });

    </script>
</head>
<body>
    <div id="parent">
        <iframe class="left" src="http://localhost/epiviz/?<?php echo $_SERVER['QUERY_STRING'] ?>"></iframe>
        <iframe class="right" src="http://localhost/epiviz-dev/?<?php echo $_SERVER['QUERY_STRING'] ?>"></iframe>
        <svg class="left"></svg>
        <svg class="left"></svg>
    </div>
</body>
</html>