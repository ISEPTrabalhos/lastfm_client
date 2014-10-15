<?php
class DB {
    private $_pdo,
        $_results,
	    $_count,
        $_errors;

	public function __construct($db_host, $db_name, $db_username, $db_password){
		$this->_errors = 0;
        try{
            $this->_pdo = new PDO(
	            'mysql:host=' . $db_host .
                ';dbname=' . $db_name ,
                $db_username,
                $db_password);
        }catch(Exception $e){
        	$this->_errors++;
        }
    }

    /**
     * prepareQuery
     *
     * Bind all the information on query
     *
     * @param $sql string sql to DB execute
     * @param $args array of arguments to bind on $sql string
     * @return bool false if it go wrong
     */
	private function prepareQuery($sql, $args = array()){
		foreach($args as $option => $data){
			$key = strtoupper($option);
			$sql .= " " . $key;
			switch($key){
				case 'WHERE':
					if((count($data) % 3) != 0) throw new Exception();
					$sql .= ' ' . $data[0] . ' ' . $data[1] . ' ?';
					break;
			}
		}

		$query = $this->_pdo->prepare($sql);
		$i = 1;

		foreach($args as $option => $data) {
			$query->bindParam($i ,$data[2]);
			$i++;
		}

		return $query;
	}

	/**
	 * flush
	 *
	 * Reset query requests
	 *
	 */
	private function flush() {
		// INIT
		$this->_count = 0;
		$this->_errors = 0;
		$this->_results = array();
	}

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
    public function select($table, $args = array()) {
	    if(!isset($this->_pdo)) return false;
	    $this->flush();

	    try{

		    $sql = "SELECT * FROM {$table}";
		    $query = $this->prepareQuery($sql, $args);
		    $query->execute();
		    while($row = $query->fetch(PDO::FETCH_ASSOC)){
			    $this->_results[$this->_count] = $row;
			    $this->_count++;
		    }

	    }catch(Exception $e){return false; $this->_errors++;}
    }

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
    public function insert($table, $args = array()) {
	    if(!isset($this->_pdo)) return false;
	    $this->flush();

	    try{
		    $sql = "INSERT INTO {$table}";
		    $start = "";
		    $end = "";

		    foreach($args as $key => $value){
			    $start .= $key . ', ';
			    $end .= ':' . $key . ', ';
		    }

		    $start = trim($start);
		    $end = trim($end);
		    $start = rtrim($start, ",");
		    $end = rtrim($end, ",");

		    $sql .= ' (' . $start . ') VALUES (' . $end .')';
		    $query = $this->_pdo->prepare($sql);

		    foreach($args as $key => $value){
			    $query->bindValue($key, $value);
		    }

		    return $query->execute();

	    }catch(Exception $e){return false;$this->_errors++;}
    }

	public function insertUniq($table, $args = array()) {
		$this->insert($table, $args);
	}

	public function getResults(){
		return (isset($this->_results)) ? $this->_results : false;
	}

	public function getCount(){
		return (isset($this->_count)) ? $this->_count : 0;
	}

	public function getErrors(){
		return (isset($this->_errors)) ? $this->_errors : 0;
	}

	public function setCharSetUTF8() {
		$this->_pdo->exec("SET CHARACTER SET utf8");
	}
}