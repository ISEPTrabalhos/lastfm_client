<?php
class DB {
    private $_connection;
    private $_info = array();
    private $_num;
    private $_result;

    public function __construct($db_hostname, $db_database, $db_username, $db_password) {
        $this->_info['db_hostname'] = $db_hostname;
        $this->_info['db_database'] = $db_database;
        $this->_info['db_username'] = $db_username;
        $this->_info['db_password'] = $db_password;

        try{
            // Start connects and chose the DB
            $this->_connection = mysql_connect($db_hostname, $db_username, $db_password);
            mysql_select_db($db_database, $this->_connection);
        }catch(Exception $e){}
    }

    public function exec($query) {
        try {
            $recordset = mysql_query($query, $this->_connection);
            $this->_num = mysql_num_rows($recordset);
            $this->_result = mysql_fetch_array($recordset);
            return true;
        }catch(Exception $e){
            return false;
        }
    }

    public function getResults() {
        return (isset($this->_result)) ? $this->_result : null;
    }

    public function endConnection(){
        mysql_close();
    }

}