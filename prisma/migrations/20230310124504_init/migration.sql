-- CreateTable
CREATE TABLE "Keyword" (
    "id" BIGSERIAL NOT NULL,
    "keyword" JSONB NOT NULL,
    "is_new" BOOLEAN NOT NULL,
    "description_by_commitee" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "equation" TEXT NOT NULL,
    "approved_date_by_commitee" TIMESTAMP(3) NOT NULL,
    "description_by_councile" TIMESTAMP(3) NOT NULL,
    "finally_approvied_date_by_council" TIMESTAMP(3) NOT NULL,
    "attributesId" INTEGER,
    "responsible_PeopleId" INTEGER,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attributes" (
    "id" SERIAL NOT NULL,
    "attribute_name" TEXT NOT NULL,

    CONSTRAINT "Attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsible_People" (
    "id" SERIAL NOT NULL,
    "responsible_name" TEXT NOT NULL,

    CONSTRAINT "Responsible_People_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_attributesId_fkey" FOREIGN KEY ("attributesId") REFERENCES "Attributes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_responsible_PeopleId_fkey" FOREIGN KEY ("responsible_PeopleId") REFERENCES "Responsible_People"("id") ON DELETE SET NULL ON UPDATE CASCADE;
