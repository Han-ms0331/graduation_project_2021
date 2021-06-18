create table dataset(
    No INT NOT NULL auto_increment primary key,
    location_tag VARCHAR(100) NOT NULL
)ENGINE=MYISAM CHARSET=utf8;

ALTER TABLE dataset MODIFY COLUMN No VARCHAR(30) NOT NULL primary key;

create table data_array(
    a_no INT NOT NULL auto_increment primary key,
    location_tag VARCHAR(100) NOT NULL,
    dataset_no INT NOT NULL,
    x_location VARCHAR(50) NOT NULL,
    y_location VARCHAR(50) NOT NULL,
    FOREIGN KEY (location_tag) references dataset(location_tag),
    FOREIGN KEY (dataset_no) references dataset(No)
)ENGINE=MYISAM CHARSET=utf8;