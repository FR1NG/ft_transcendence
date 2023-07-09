#!/bin/bash

npx prisma migrate prod --name deploy

exec $@
