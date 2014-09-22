<!--<?php
?>-->
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <link href="css/main.css" rel="stylesheet" />

    <script src="src/lib/jquery/jquery-1.8.2.js"></script>

  <script>
    $(function() {
      $('.left').load(function(){
        $($(this).contents()[0]).click(function(e) {
          var x = e.pageX;
          var y = e.pageY;
          $($('.right').contents()[0].elementFromPoint(x, y)).click();
        });

        /*$($(this).contents()[0]).mouseenter(function(e) {
          var x = e.pageX;
          var y = e.pageY;
          $($('#right').contents()[0].elementFromPoint(x, y)).mouseenter();
        });*/


      });
    });

  </script>
</head>
<body>
    <div id="parent">
        <iframe class="left" src="http://localhost/epiviz/?<?php echo $_SERVER['QUERY_STRING'] ?>"></iframe>
        <iframe class="right" src="http://localhost/epiviz-dev/?<?php echo $_SERVER['QUERY_STRING'] ?>"></iframe>

    </div>
</body>
</html>