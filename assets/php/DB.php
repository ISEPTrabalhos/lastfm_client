<?php
class DB {
	private static $_instance;
	private $_pdo,
			$_results,
			$_count,
			$_errors;

	// pattern design pattern
	private function __construct($db_host, $db_name, $db_username, $db_password){
		$this->_errors = 0;
        try{
            $this->_pdo = new PDO(
                'mysql:host=' . $db_host .
                ';dbname=' . $db_name ,
                $db_username,
                $db_password);
        }catch(PDOException $e){
        	$this->_errors++;
            die($e->getMessage());
        }
    }

    public static function getInstance(){
        if(!isset(self::$_instance)){
            self::$_instance = new DB();
        }
        return self::$_instance;
    }

    /**
     * query
     *
     * Execute query, bind all the information on array
     * and store all the data in results and count var's
     *
     * @param $sql string sql to DB execute
     * @param $args array of arguments to bind on $sql string
     * @return bool false if it go wrong
     */
    private function query($sql, $args = array()) {}

    /**
     * select
     *
     * Uses the query function to select data from some table
     * and store teresults under results variable.
     *
     * Example:.
     * : select('users',array('id' =>'1'));
     * : SELECT * FROM users WHERE id = :id
     * : BIND :id = 1
     *
     * @param $table string table to execute query
     * @param $where array associative array of condition values 
     * @return bool false if it go wrong
     */
    public function select($table, $where = array()) {}

    /**
     * insert
     *
     * Execute query and bind all the information on array
     *
     * Example:.
     * : insert('users',array('id' =>'null', 'name' => 'adam'));
     * : INSERT * INTO users (id, name) VALUES (:id, :name);
     * : BIND :id = null
     * : BIND :name = adam
     *
     * @param $table string table to execute query
     * @param $args array associative array of values to add
     * @return bool false if it go wrong
     */
    public function insert($table, $args = array()) {}
}