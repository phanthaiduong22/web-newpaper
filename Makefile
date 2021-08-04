all: build up

test: build test-server

build:
	@docker-compose build

up: 
	@docker-compose up -d

test-server: 
	@docker-compose up