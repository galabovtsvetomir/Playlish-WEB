<?php

class DuplicateUserException extends Exception {
    public function __construct($message) {
        parent::__construct($message);
    }
}