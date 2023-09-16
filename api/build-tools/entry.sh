#!/bin/bash

npx prisma generate && npx npx prisma db push 

exec $@
