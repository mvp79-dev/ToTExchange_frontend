deploy-happy-stg:
	rsync -ae "ssh -o StrictHostKeyChecking=no" -vhzL --delete \
	--no-perms --no-owner --no-group \
	./build .env happy-stg:/home/ubuntu/happy-ui
deploy-happy:
	rsync -ae "ssh -o StrictHostKeyChecking=no" -vhzL --delete \
	--no-perms --no-owner --no-group \
	./build .env happy-prod:/home/ubuntu/happy-ui