package ic.pesquisa.projeto.demo.Domain;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import org.springframework.core.convert.converter.Converter;

import java.io.IOException;

public class StringArrayToJsonConverter implements AttributeConverter<String[], String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(String[] attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            // Converte o array para uma string JSON
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao converter array para JSON", e);
        }
    }

    @Override
    public String[] convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new String[0];
        }
        try {
            // Converte a string JSON de volta para um array
            return objectMapper.readValue(dbData, String[].class);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao converter JSON para array", e);
        }
    }

}
