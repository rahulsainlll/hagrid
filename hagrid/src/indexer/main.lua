
_0RBIT = "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ"
_0RBT_TOKEN = "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"

BASE_URL = "https://api.weavescan.dev/api/content/items/projects"
FEE_AMOUNT = "1000000000000" -- 1 $0RBT


Handlers.add(
	"Get-Request",
	Handlers.utils.hasMatchingTag("Action", "First-Get-Request"),
	function(msg)
		Send({
			Target = _0RBT_TOKEN,
			Action = "Transfer",
			Recipient = _0RBIT,
			Quantity = FEE_AMOUNT,
			["X-Url"] = BASE_URL,
			["X-Action"] = "Get-Real-Data"
		})
		print(Colors.green .. "You have sent a GET Request to the 0rbit process.")
	end
)


local json = require("json")

Handlers.add(
	"ReceiveData",
	Handlers.utils.hasMatchingTag("Action", "Receive-Response"),
	function(msg)
		local res = json.decode(msg.Data)
		ReceivedData = res
		print(Colors.green .. "You have received the data from the 0rbit process.")
	end
)


ReceivedData = ReceivedData or {}


Send({Target="BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc", Action="Balance"})


Inbox[#Inbox].Data

Send({ Target= ao.id, Action="First-Get-Request" })


local data = ReceivedData
-- Function to filter projects based on a query
function filterProjects(query, projects)
    local keywords = {}
    for word in string.gmatch(query, "%S+") do
        table.insert(keywords, word:lower())
    end
    
    function matches(project)
        for _, keyword in ipairs(keywords) do
            local found = false
            
            -- Convert entire project to lowercase string for comprehensive search
            local projectString = json.encode(project):lower()
            
            -- Explicit checks for key fields
            if project.title and project.title:lower():find(keyword) then found = true end
            if project.description and project.description:lower():find(keyword) then found = true end
            if project.link and project.link:lower():find(keyword) then found = true end
            
            -- Check tags
            if project.tags then
                for _, tag in ipairs(project.tags) do
                    if tag:lower():find(keyword) then
                        found = true
                        break
                    end
                end
            end
            
            -- Fallback to full project string search
            if not found and projectString:find(keyword) then
                found = true
            end
            
            if not found then return false end
        end
        return true
    end
    
    -- Filter the projects
    local result = {}
    for _, project in ipairs(projects) do
        if matches(project) then
            table.insert(result, project)
        end
    end
    
    return result
end



json = require('json')


Handlers.add("Fuzzy-Query", Handlers.utils.hasMatchingTag("Action", "Query"), function(msg)
    -- Allow optional distance parameter, default to 2
    local maxDistance = tonumber(msg.Distance) or 2
    local filteredProjects = fuzzyFilterProjects(msg.Data, ReceivedData, maxDistance)

    -- Print the filtered projects
    print(Colors.blue .. "Query: " .. msg.Data)
    print(Colors.blue .. "Filtered Projects Count: " .. #filteredProjects)
    for i, project in ipairs(filteredProjects) do
        print(Colors.yellow .. "Project " .. i .. ":")
        print("  Title: " .. (project.title or "N/A"))
        print("  Description: " .. (project.description or "N/A"))
        print("  Link: " .. (project.link or "N/A"))
        print("  Tags: " .. table.concat(project.tags or {}, ", "))
    end

    msg.reply({
        Data = json.encode(filteredProjects),
        Action = "Last.Reply"
    })
end)

json = require('json')
Handlers.add("Index", Handlers.utils.hasMatchingTag("Action", "Index"), function(msg)
    -- Parse the incoming project data
    local success, newProject = pcall(json.decode, msg.Data)
    
    -- Check if JSON parsing was successful
    if not success then
        msg.reply({
            Action = "Index.Error",
            Data = json.encode({
                error = "Invalid JSON format",
                status = "failed"
            })
        })
        return
    end
    
    -- Basic validation to ensure title exists
    if not newProject.title or newProject.title == "" then
        msg.reply({
            Action = "Index.Error",
            Data = json.encode({
                error = "Project title is required",
                status = "failed"
            })
        })
        return
    end
    
    -- Ensure all expected fields are present
    local projectToStore = {
        title = newProject.title,
        slug = newProject.slug or "",
        description = newProject.description or "",
        link = newProject.link or "",
        twitter = newProject.twitter or "",
        discord = newProject.discord or "",
        telegram = newProject.telegram or "",
        tags = newProject.tags or {}
    }
    
    -- Add to ReceivedData
    table.insert(ReceivedData, projectToStore)
    
    -- Respond with success
    msg.reply({
        Action = "Index.Success",
        Data = json.encode({
            message = "Project added successfully",
            project = projectToStore,
            status = "success"
        })
    })
end)

Send({
    Target = ao.id,
    Action = "Index",
    Data = json.encode({
        title = "Ankush Kun",
        slug = "Betteridea",
        description = "Entrepreneur In Residence @ Forward Research (Arweave). Community Manager @ ArweaveIndia. Founder of BetterIDEa",
        link = "https://ankush.one",
        twitter = "https://x.com/ankushkun_",
        tags = {"Betteridea", "Founder", "Community Manager"}
    })
})

-- Levenshtein Distance Algorithm
function levenshteinDistance(str1, str2)
    -- Convert to lowercase for case-insensitive comparison
    str1 = str1:lower()
    str2 = str2:lower()
    
    -- Create distance matrix
    local matrix = {}
    for i = 0, #str1 do
        matrix[i] = {[0] = i}
    end
    for j = 0, #str2 do
        matrix[0][j] = j
    end
    
    -- Compute Levenshtein distance
    for i = 1, #str1 do
        for j = 1, #str2 do
            local cost = (str1:sub(i,i) == str2:sub(j,j)) and 0 or 1
            matrix[i][j] = math.min(
                matrix[i-1][j] + 1,      -- Deletion
                matrix[i][j-1] + 1,      -- Insertion
                matrix[i-1][j-1] + cost  -- Substitution
            )
        end
    end
    
    return matrix[#str1][#str2]
end

-- Enhanced filter function with Levenshtein distance
function fuzzyFilterProjects(query, projects, maxDistance)
    maxDistance = maxDistance or 2  -- Default max edit distance
    local keywords = {}
    for word in string.gmatch(query, "%S+") do
        table.insert(keywords, word:lower())
    end
    
    function matches(project)
        for _, keyword in ipairs(keywords) do
            local found = false
            
            -- Check key fields with Levenshtein distance
            local fieldsToCheck = {
                project.title or "",
                project.description or "",
                project.link or "",
                project.slug or ""
            }
            
            -- Check tags separately
            if project.tags then
                for _, tag in ipairs(project.tags) do
                    table.insert(fieldsToCheck, tag)
                end
            end
            
            -- Check Levenshtein distance for each field
            for _, field in ipairs(fieldsToCheck) do
                if type(field) == "string" then
                    local fieldLower = field:lower()
                    local distance = levenshteinDistance(keyword, fieldLower)
                    if distance <= maxDistance then
                        found = true
                        break
                    end
                end
            end
            
            if not found then return false end
        end
        return true
    end
    
    -- Filter the projects
    local result = {}
    for _, project in ipairs(projects) do
        if matches(project) then
            table.insert(result, project)
        end
    end
    
    return result
end



























-- ReceivedData

-- local data = ReceivedData
-- -- Function to filter projects based on a query
-- function filterProjects(query, projects)
--     local keywords = {}
--     for word in string.gmatch(query, "%S+") do
--         table.insert(keywords, word:lower())
--     end
    
--     function matches(project)
--         for _, keyword in ipairs(keywords) do
--             local found = false
            
--             -- Convert entire project to lowercase string for comprehensive search
--             local projectString = json.encode(project):lower()
            
--             -- Explicit checks for key fields
--             if project.title and project.title:lower():find(keyword) then found = true end
--             if project.description and project.description:lower():find(keyword) then found = true end
--             if project.link and project.link:lower():find(keyword) then found = true end
            
--             -- Check tags
--             if project.tags then
--                 for _, tag in ipairs(project.tags) do
--                     if tag:lower():find(keyword) then
--                         found = true
--                         break
--                     end
--                 end
--             end
            
--             -- Fallback to full project string search
--             if not found and projectString:find(keyword) then
--                 found = true
--             end
            
--             if not found then return false end
--         end
--         return true
--     end
    
--     -- Filter the projects
--     local result = {}
--     for _, project in ipairs(projects) do
--         if matches(project) then
--             table.insert(result, project)
--         end
--     end
    
--     return result
-- end

-- json = require('json')
	
-- Handlers.add("Last.Last", Handlers.utils.hasMatchingTag("Action", "Query"), function(msg)
--     local filteredProjects = filterProjects(msg.Data, ReceivedData)

--     msg.reply({
--         Data = json.encode(filteredProjects),
--         Action = "Last.Reply"
--     })
-- end)


-- json = require('json')
-- Handlers.add("Index", Handlers.utils.hasMatchingTag("Action", "Index"), function(msg)
--     -- Parse the incoming project data
--     local success, newProject = pcall(json.decode, msg.Data)
    
--     -- Check if JSON parsing was successful
--     if not success then
--         msg.reply({
--             Action = "Index.Error",
--             Data = json.encode({
--                 error = "Invalid JSON format",
--                 status = "failed"
--             })
--         })
--         return
--     end
    
--     -- Basic validation to ensure title exists
--     if not newProject.title or newProject.title == "" then
--         msg.reply({
--             Action = "Index.Error",
--             Data = json.encode({
--                 error = "Project title is required",
--                 status = "failed"
--             })
--         })
--         return
--     end
    
--     -- Ensure all expected fields are present
--     local projectToStore = {
--         title = newProject.title,
--         slug = newProject.slug or "",
--         description = newProject.description or "",
--         link = newProject.link or "",
--         twitter = newProject.twitter or "",
--         discord = newProject.discord or "",
--         telegram = newProject.telegram or "",
--         tags = newProject.tags or {}
--     }
    
--     -- Add to ReceivedData
--     table.insert(ReceivedData, projectToStore)
    
--     -- Respond with success
--     msg.reply({
--         Action = "Index.Success",
--         Data = json.encode({
--             message = "Project added successfully",
--             project = projectToStore,
--             status = "success"
--         })
--     })
-- end)

-- Send({
--     Target = ao.id,
--     Action = "Index",
--     Data = json.encode({
--         title = "Ankush Kun",
--         slug = "Betteridea",
--         description = "Entrepreneur In Residence @ Forward Research (Arweave). Community Manager @ ArweaveIndia. Founder of BetterIDEa",
--         link = "https://ankush.one",
--         twitter = "https://x.com/ankushkun_",
--         tags = {"Betteridea", "Founder", "Community Manager"}
--     })
-- })