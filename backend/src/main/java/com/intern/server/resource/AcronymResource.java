package com.intern.server.resource;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.intern.server.mapper.AcronymMapper;
import com.intern.server.mapper.ChangesMapper;
import com.intern.server.model.Acronym;
import com.intern.server.model.Changes;

@RestController
@RequestMapping("/api/acronym")
public class AcronymResource {
	
	private AcronymMapper acronymMapper;
	private ChangesMapper changesMapper;
	
	public AcronymResource(AcronymMapper acronymMapper, ChangesMapper changesMapper) {
		this.acronymMapper = acronymMapper;
		this.changesMapper = changesMapper;
	}
	
	@GetMapping("/all")
	public List<Acronym> getAll(@RequestParam(name = "offset") Number offset,@RequestParam(name = "limit") Number limit) {
		System.out.print("\nOffset : " + offset);
		System.out.print("Limit : " + limit);
		return acronymMapper.findPage(offset, limit);
	}
	
	@GetMapping("/all/count")
	public Integer getAllCount() {
		return acronymMapper.countAllAcronym();
	}
	
	/*@GetMapping("/all/{id}")
	public Acronym getAcronym(@PathVariable Number id) {
		System.out.print("\nAcronym where id = "+ id);
		return acronymMapper.findById((Number) id);
	}
	*/
	
	/*@GetMapping("/all/{acronym}")
	public List<Acronym> getAcronym(@PathVariable String acronym, 
			@RequestParam(name = "offset") Number offset,@RequestParam(name = "limit") Number limit) {
		System.out.print("\nAcronym where it contains = "+ acronym);
		return acronymMapper.searchForAcronym(acronym, offset, limit);
	}
	*/
	
	@GetMapping("/all/{search}")
	public List<Acronym> getSearch(@PathVariable String search, 
			@RequestParam(name = "offset") Number offset,@RequestParam(name = "limit") Number limit) {
		System.out.print("\nSearch where it contains = "+ search);
		return acronymMapper.search(search, offset, limit);
	}
	
	@GetMapping("/all/language/{search}")
	public List<Acronym> getSearchLanguage(@PathVariable String search, 
			@RequestParam(name = "offset") Number offset,@RequestParam(name = "limit") Number limit) {
		System.out.print("\nSearch language = "+ search);
		return acronymMapper.searchLanguage(search, offset, limit);
	}
	
	@GetMapping("/all/{acronym}/count")
	public Integer countGetAcronym(@PathVariable String acronym) {
		return acronymMapper.countAllSearchedAcronym(acronym);
	}
	
	@GetMapping("/all/language/{language}/count")
	public Integer countGetLanguage(@PathVariable String language) {
		return acronymMapper.countAllSearchedLanguage(language);
	}
	
	
	@DeleteMapping("/all/{id}")
	public void deleteAcronym(@PathVariable Number id) {
		this.acronymMapper.remove(id);
		System.out.print("\nAcronym where id = "+id+" has been deleted");
	}
	
	@PostMapping("/new")
	public void addAcronym(@RequestBody Acronym acronym) {
		System.out.print("\nAcronym has been added");
		this.acronymMapper.addAcronym(acronym.getAcronym(),acronym.getFull_term(),acronym.getRemark(),acronym.getLanguage(),acronym.getCreator());
	}
	
	@PutMapping("/all/{id}")
	public void updateAcronym(@RequestBody Acronym acronym) {
		this.acronymMapper.updateAcronym(acronym.getAcronym(),acronym.getFull_term(),acronym.getRemark(),acronym.getID());
		System.out.print("\nAcronym where id = "+ acronym.getID()+" has been updated");
	}
	
	@GetMapping("/changes/{id}")
	public List<Changes> getChangesForRecord(@PathVariable Number id){
		System.out.print(id);
		return this.changesMapper.getChangesOfRecord(id);
	}
	
	@PostMapping("/changes/new")
	public void addChanges(@RequestBody Changes changes) {
		this.changesMapper.addChanges(changes.getID(), changes.getChanges(), changes.getTimestamp());
	}
	
	@DeleteMapping("/changes/{id}")
	public void deleteChanges(@PathVariable Number id) {
		this.changesMapper.remove(id);
	}
	

}
