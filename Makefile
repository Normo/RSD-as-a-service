# SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
# SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
# SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
# SPDX-FileCopyrightText: 2022 Netherlands eScience Center
#
# SPDX-License-Identifier: Apache-2.0

# PHONY makes possible to call `make commands` from inside the Makefile
.PHONY: start install frontend data dev down dev-docs

# Main commands
# ----------------------------------------------------------------
start:
	docker-compose down --volumes #cleanup phase
	docker-compose build # build all services
	docker-compose up --scale data-generation=1 --scale scrapers=0 -d
	# open http://localhost to see the application running

install:
	docker-compose down --volumes #cleanup phase
	docker-compose build database backend auth scrapers nginx   # exclude frontend and wait for the build to finish
	docker-compose up --scale scrapers=0 -d
	cd frontend && yarn -d
	cd documentation && yarn -d
	# Sleep 30 seconds to be sure that docker-compose up is running
	sleep 30
	docker-compose down

dev:
	docker-compose up --scale scrapers=0 -d
	make dev-docs

down:
	docker-compose down

frontend:
	docker-compose up --scale frontend-dev=1 --scale scrapers=0 -d
	docker-compose logs -f frontend-dev

data:
	docker-compose up --scale data-generation=1 --scale scrapers=0
	sleep 60
	docker-compose down

# Helper commands
# -
dev-docs:
	cd documentation && yarn dev

frontend/.env.local: .env
	@echo "Creating frontend/.env.local"
	cp .env frontend/.env.local
	sed -i 's/POSTGREST_URL=http:\/\/backend:3500/POSTGREST_URL=http:\/\/localhost\/api\/v1/g' frontend/.env.local
	sed -i 's/RSD_AUTH_URL=http:\/\/auth:7000/RSD_AUTH_URL=http:\/\/localhost\/auth/g' frontend/.env.local
