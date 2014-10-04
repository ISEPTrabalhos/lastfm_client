<?php
class DB {
    private $_connection;
    private $_info = array();
    private $_num;
    private $_result;
    private $_enable = false;

    public function __construct($db_hostname, $db_database, $db_username, $db_password) {
        $this->_info['db_hostname'] = $db_hostname;
        $this->_info['db_database'] = $db_database;
        $this->_info['db_username'] = $db_username;
        $this->_info['db_password'] = $db_password;

        try{
            // Start connects and chose the DB
            $this->_connection = @mysql_connect($db_hostname, $db_username, $db_password);
            if(!$this->_connection) throw new Exception("");

            mysql_select_db($db_database, $this->_connection);
            $this->_enable = true;
        }catch(Exception $e){echo $e->getMessage();}
    }

    public function select($query) {
        if(!$this->_enable) return;
        try {
            $record = mysql_query($query);

            $this->_result = array();
            $this->_num = 0;

            while(($row = mysql_fetch_array($record, MYSQL_ASSOC))) {
                $this->_result[$this->_num] = $row;
                $this->_num++;
            }

            if($record === false) throw new Exception(mysql_error());
            return true;
        }catch(Exception $e){
            echo $e->getMessage();
            return false;
        }
    }

    public function insert($query) {
        if(!$this->_enable) return;
        try {
            $record = mysql_query($query);
            if($record === false) throw new Exception(mysql_error());
            return true;
        }catch(Exception $e){
            echo $e->getMessage();
            return false;
        }
    }

    public function getResults() {
        if(!$this->_enable) return;
        return (isset($this->_result)) ? $this->_result : null;
    }

    public function getFirst() {
        if(!$this->_enable) return;
        $var = (isset($this->_result)) ? $this->_result[0] : null;
        return $var;
    }

    public function getNumElem(){
        if(!$this->_enable) return;
        return (isset($this->_num)) ? $this->_num : 0;
    }

    public function endConnection(){
        if(!$this->_enable) return;
        mysql_close();
    }
}