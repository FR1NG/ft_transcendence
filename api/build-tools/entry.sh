#!/bin/bash

npx prisma generate \
  && npx npx prisma db push \
  && npx prisma db seed

exec $@
