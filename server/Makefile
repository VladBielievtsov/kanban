dev:
	@go run cmd/api/main.go

run: build
	@./bin/kanban

build:
	@go build -o bin/kanban cmd/api/main.go

# drop:
# 	@go run cmd/drop/main.go