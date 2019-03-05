package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the TodoController.
 * <p>
 * Created by Kaelan on 3/5/19.
 */
public class TodoControllerSpec {
  private TodoController todoController;
  private ObjectId samsId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Chris\",\n" +
      "                    status: false,\n" +
      "                    category: \"UMM\",\n" +
      "                    body: \"Blah Blah Blah\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Pat\",\n" +
      "                    status: true,\n" +
      "                    category: \"IBM\",\n" +
      "                    body: \"Bleh Bleh Bleh\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Jamie\",\n" +
      "                    status: true,\n" +
      "                    category: \"Frogs, Inc.\",\n" +
      "                    body: \"Bluh Bluh Bluh\"\n" +
      "                }"));

    samsId = new ObjectId();
    BasicDBObject sam = new BasicDBObject("_id", samsId);
    sam = sam.append("owner", "Sam")
      .append("status", "false")
      .append("category", "Frogs, Inc.")
      .append("body", "sam@frogs.com");


    todoDocuments.insertMany(testTodos);
    todoDocuments.insertOne(Document.parse(sam.toJson()));

    // It might be important to construct this _after_ the DB is set up
    // in case there are bits in the constructor that care about the state
    // of the database.
    todoController = new TodoController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getName(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("owner")).getValue();
  }

  @Test
  public void getAllTodos() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = todoController.getTodos(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 todos", 4, docs.size());
    List<String> owners = docs
      .stream()
      .map(TodoControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Chris", "Jamie", "Pat", "Sam");
    assertEquals("Names should match", expectedNames, owners);
  }

  @Test
  public void getTrueStatus() {
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("status", new String[]{"true"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 2 todos", 2, docs.size());
    List<String> owners = docs
      .stream()
      .map(TodoControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedNames = Arrays.asList("Jamie", "Pat");
    assertEquals("Names should match", expectedNames, owners);
  }

  @Test
  public void getSamById() {
    String jsonResult = todoController.getTodo(samsId.toHexString());
    Document sam = Document.parse(jsonResult);
    assertEquals("Name should match", "Sam", sam.get("owner"));
    String noJsonResult = todoController.getTodo(new ObjectId().toString());
    assertNull("No owner should match", noJsonResult);

  }

  @Test
  public void addTodoTest() {
    String newId = todoController.addNewTodo("Brian",true, "umm", "Insert Text Here");

    assertNotNull("Add new todo should return true when todo is added,", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("status", new String[]{"true"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> owner = docs
      .stream()
      .map(TodoControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return owner of new todo", "Brian", owner.get(0));
  }

  @Test
  public void getTodoByCompany() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in TodoController is doing a regex search so can just take a Java Reg. Expression
    //This will search the category starting with an I or an F
    argMap.put("category", new String[]{"[I,F]"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 3 todos", 3, docs.size());
    List<String> owner = docs
      .stream()
      .map(TodoControllerSpec::getName)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedName = Arrays.asList("Jamie", "Pat", "Sam");
    assertEquals("Names should match", expectedName, owner);

  }


}
