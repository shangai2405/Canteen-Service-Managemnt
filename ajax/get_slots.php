<?php
include("../config/db.php");

$res = $conn->query("
SELECT slot_id,start_time,end_time
FROM time_slots
ORDER BY start_time
");

$out=[];

while($r=$res->fetch_assoc()){
    $out[]=$r;
}

echo json_encode($out);
