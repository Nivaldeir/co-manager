-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "department" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "estimatedVolume" TEXT,
    "currentProcess" TEXT,
    "expectedBenefits" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "estimatedROI" REAL,
    "estimatedCost" REAL,
    "estimatedTime" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quotations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "card_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'custom',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "customFields" JSONB,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "card_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "flow_nodes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "customTypeId" TEXT,
    "positionX" REAL NOT NULL,
    "positionY" REAL NOT NULL,
    "reactFlowId" TEXT,
    "estimatedTime" TEXT,
    "peopleInvolved" TEXT,
    "frequency" TEXT,
    "complexity" TEXT,
    "systems" TEXT,
    "errors" TEXT,
    "cost" TEXT,
    "metadata" JSONB,
    "userId" TEXT,
    "asIsQuotationId" TEXT,
    "toBeQuotationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "flow_nodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "flow_nodes_asIsQuotationId_fkey" FOREIGN KEY ("asIsQuotationId") REFERENCES "quotations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "flow_nodes_toBeQuotationId_fkey" FOREIGN KEY ("toBeQuotationId") REFERENCES "quotations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "flow_node_connections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "sourceHandle" TEXT,
    "targetHandle" TEXT,
    "label" TEXT,
    "condition" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "flow_node_connections_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "flow_nodes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "flow_node_connections_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "flow_nodes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quotation_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quotationId" TEXT NOT NULL,
    "totalSteps" INTEGER NOT NULL DEFAULT 0,
    "totalConnections" INTEGER NOT NULL DEFAULT 0,
    "averageComplexity" TEXT,
    "estimatedSavings" REAL,
    "estimatedROI" REAL,
    "estimatedCost" REAL,
    "timeReduction" REAL,
    "analysisData" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quotation_analyses_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quotation_replies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quotationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quotation_replies_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "quotations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quotation_replies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "quotations_userId_idx" ON "quotations"("userId");

-- CreateIndex
CREATE INDEX "quotations_status_idx" ON "quotations"("status");

-- CreateIndex
CREATE INDEX "quotations_createdAt_idx" ON "quotations"("createdAt");

-- CreateIndex
CREATE INDEX "card_templates_userId_idx" ON "card_templates"("userId");

-- CreateIndex
CREATE INDEX "card_templates_category_idx" ON "card_templates"("category");

-- CreateIndex
CREATE INDEX "flow_nodes_userId_idx" ON "flow_nodes"("userId");

-- CreateIndex
CREATE INDEX "flow_nodes_asIsQuotationId_idx" ON "flow_nodes"("asIsQuotationId");

-- CreateIndex
CREATE INDEX "flow_nodes_toBeQuotationId_idx" ON "flow_nodes"("toBeQuotationId");

-- CreateIndex
CREATE INDEX "flow_nodes_type_idx" ON "flow_nodes"("type");

-- CreateIndex
CREATE INDEX "flow_nodes_reactFlowId_idx" ON "flow_nodes"("reactFlowId");

-- CreateIndex
CREATE INDEX "flow_node_connections_fromNodeId_idx" ON "flow_node_connections"("fromNodeId");

-- CreateIndex
CREATE INDEX "flow_node_connections_toNodeId_idx" ON "flow_node_connections"("toNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "flow_node_connections_fromNodeId_toNodeId_sourceHandle_targetHandle_key" ON "flow_node_connections"("fromNodeId", "toNodeId", "sourceHandle", "targetHandle");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_analyses_quotationId_key" ON "quotation_analyses"("quotationId");

-- CreateIndex
CREATE INDEX "quotation_replies_quotationId_idx" ON "quotation_replies"("quotationId");

-- CreateIndex
CREATE INDEX "quotation_replies_userId_idx" ON "quotation_replies"("userId");

-- CreateIndex
CREATE INDEX "quotation_replies_createdAt_idx" ON "quotation_replies"("createdAt");
